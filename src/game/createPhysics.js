const meterInPixels = 100;
const maxSpeed = 1.5;

const updatePosition = (drop) => {
    drop.position.x = drop.element.offsetParent.scrollLeft + drop.element.offsetLeft
    drop.position.y = drop.element.offsetParent.scrollTop + drop.element.offsetTop;
};

const initializeDrop = (drop) => {
    updatePosition(drop);
    drop.forces = [];
};

const addGravity = (drop) => {
  drop.forces.push({
      x: 0.0,
      y: 9.81
  });
};

const addPressure = (drop, pressurePosition, offset) => {
    const pressureVector = {
        x: pressurePosition.x - drop.position.x,
        y: pressurePosition.y - drop.position.y
    };
    const distance = Math.sqrt(pressureVector.x**2 + pressureVector.y**2);
    const pressureNormalized = Math.min((offset - distance) / (drop.softRadius - drop.coreRadius), 1.0);
    if (distance > 0.0 && pressureNormalized > 0.0) {
        drop.forces.push({
            x: (pressureVector.x / distance) * (drop.adhesiveness - pressureNormalized * drop.elasticity),
            y: (pressureVector.y / distance) * (drop.adhesiveness - pressureNormalized * drop.elasticity)
        })
    }
}

const addWallPressures = (drop, walls) => {
    walls.forEach(wall => {
        const ap = {
            x: drop.position.x - wall.position.x,
            y: drop.position.y - wall.position.y
        };
        const t = Math.max(0, Math.min(1,
            (ap.x * wall.length.x + ap.y * wall.length.y) /
            (wall.length.x**2 + wall.length.y**2)
        ));
        const projection = {
            x: wall.position.x + t * wall.length.x,
            y: wall.position.y + t * wall.length.y
        };
        addPressure(drop, projection, drop.softRadius);
    });
};

const addDropPressures = (drop, drops) => {
    drops.forEach(otherDrop => {
        if (drop === otherDrop) {
            return;
        }
        updatePosition(otherDrop);
        addPressure(drop, otherDrop.position, 2 * drop.softRadius);
    });
};

const findWallCollision = (position, vector, wall) => {
    const denominator = vector.x * wall.length.y - vector.y * wall.length.x;
    if (denominator === 0) {
        return null;
    }
    const positionToWall = {
        x: wall.position.x - position.x,
        y: wall.position.y - position.y
    };
    const vectorCollisionFactor = (positionToWall.x * wall.length.y - positionToWall.y * wall.length.x) / denominator;
    if (vectorCollisionFactor < 0.0 || vectorCollisionFactor > 1.0) {
        return null;
    }
    const wallCollision = (positionToWall.x * vector.y - positionToWall.y * vector.x) / denominator;
    if (wallCollision < 0.0 || wallCollision > 1.0) {
        return null;
    }
    return vectorCollisionFactor;
};

const findDropCollision = (position, vector, drop) => {
    const ap = {
        x: drop.position.x - position.x,
        y: drop.position.y - position.y
    };
    const t = Math.min(1.0,
        (ap.x * vector.x + ap.y * vector.y) / (vector.x**2 + vector.y**2)
    );
    if (t <= 0.0) {
        return null;
    }
    const nearestPosition = {
        x: position.x + t * vector.x,
        y: position.y + t * vector.y
    };
    const distance = Math.sqrt(
        (nearestPosition.x - drop.position.x)**2 + (nearestPosition.y - drop.position.y)**2
    );
    if (distance > drop.coreRadius) {
        return null;
    }
    return t;
};

const avoidCollisions = (drop, nextPosition, walls, drops) => {
    const movementVector = {
        x: nextPosition.x - drop.position.x,
        y: nextPosition.y - drop.position.y
    };
    const movementLength = Math.sqrt(movementVector.x**2 + movementVector.y**2);
    if (movementLength === 0) {
        return 1.0;
    }
    const coreRadiusFactor = drop.coreRadius / movementLength;

    const collisionFactors = [];
    walls.forEach(wall => {
        const collisionFactor = findWallCollision(drop.position, movementVector, wall);
        if (collisionFactor !== null) {
            collisionFactors.push(collisionFactor - coreRadiusFactor);
        }
    });
    drops.forEach(otherDrop => {
        if (drop !== otherDrop) {
            const collisionFactor = findDropCollision(drop.position, movementVector, otherDrop);
            if (collisionFactor !== null) {
                collisionFactors.push(collisionFactor);
            }
        }
    });
    if (collisionFactors.length === 0) {
        return 1.0;
    }
    const nearestCollisionFactors = collisionFactors
        .sort((collision1, collision2) => collision1 - collision2);
    const nearestCollisionFactor = nearestCollisionFactors[0];

    nextPosition.x = drop.position.x + movementVector.x * nearestCollisionFactor;
    nextPosition.y = drop.position.y + movementVector.y * nearestCollisionFactor;

    return nearestCollisionFactor;
};

const applyForces = (drop, elapsedTime, walls, drops) => {
    const force = {
        x: 0.0,
        y: 0.0
    }
    drop.forces.forEach(pressure => {
        force.x += pressure.x;
        force.y += pressure.y;
    });

    drop.speed.x += force.x * elapsedTime;
    drop.speed.y += force.y * elapsedTime;

    const speed = Math.sqrt(drop.speed.x**2 + drop.speed.y**2);
    if (speed !== 0) {
        const reducedSpeed = Math.min(speed, maxSpeed);
        drop.speed.x *= reducedSpeed / speed;
        drop.speed.y *= reducedSpeed / speed;
    }

    const nextPosition = {
        x: drop.position.x + drop.speed.x * meterInPixels,
        y: drop.position.y + drop.speed.y * meterInPixels
    };
    const movementReductionFactor = avoidCollisions(drop, nextPosition, walls, drops);

    const animationSlowness = Math.max(0.1, movementReductionFactor);
    drop.element.style.left = `${nextPosition.x}px`;
    drop.element.style.top = `${nextPosition.y}px`;
    drop.element.style.transition = `left ${animationSlowness}s linear, top ${animationSlowness}s linear`;
};

export default (level) => {
    const drops = [];

    const moveDrop = (drop) => {
        const currentTime = performance.now() / 1000.0;
        const elapsedTime = currentTime - drop.time;

        initializeDrop(drop);
        addGravity(drop);
        addWallPressures(drop, level.walls);
        addDropPressures(drop, drops);
        applyForces(drop, elapsedTime, level.walls, drops);

        drop.time = currentTime;

        window.setTimeout(() => moveDrop(drop), 50);
    };

    return {
        addDrop: (drop) => {
            drops.push(drop);
            moveDrop(drop);
        }
    }
}