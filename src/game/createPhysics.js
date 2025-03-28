const meterInPixels = 100;

const updatePosition = (drop) => {
    drop.position.x = drop.element.offsetParent.scrollLeft + drop.element.offsetLeft
    drop.position.y = drop.element.offsetParent.scrollTop + drop.element.offsetTop;
};

const initializeDrop = (drop) => {
    updatePosition(drop);
    drop.pressures = [];
    drop.force.x = 0;
    drop.force.y = 0;
};

const addGravity = (drop) => {
  drop.force.y += 9.81;
};

const addAirResistance = (drop) => {
    drop.force.x -= drop.airResistanceFactor * drop.speed.x;
    drop.force.y -= drop.airResistanceFactor * drop.speed.y;
};

const applyWallCollision = (drop, walls) => {
    const movement = {
        x: drop.position.x - drop.lastPosition.x,
        y: drop.position.y - drop.lastPosition.y
    };
    const movementLength = Math.sqrt(movement.x**2 + movement.y**2);
    if (movementLength === 0) {
        return;
    }
    const coreRadiusFactor = drop.coreRadius / movementLength;

    const firstCollision = walls.map(wall => {
        const denominator = movement.x * wall.length.y - movement.y * wall.length.x;
        if (denominator === 0) {
            return null;
        }
        const lastPositionToWall = {
            x: wall.position.x - drop.lastPosition.x,
            y: wall.position.y - drop.lastPosition.y
        };
        const movementCollision = (lastPositionToWall.x * wall.length.y - lastPositionToWall.y * wall.length.x) / denominator;
        if (movementCollision < 0.0 || movementCollision > (1.0 + coreRadiusFactor)) {
            return null;
        }
        const wallCollision = (lastPositionToWall.x * movement.y - lastPositionToWall.y * movement.x) / denominator;
        if (wallCollision < 0.0 || wallCollision > 1.0) {
            return null;
        }
        return {
            wall,
            factor: movementCollision
        };
    }).filter(collision => collision !== null).sort((collision1, collision2) => collision1.factor - collision2.factor)[0];

    if (firstCollision === undefined) {
        return;
    }
    const { wall, factor } = firstCollision;

    const dotProduct = drop.speed.x * wall.length.x + drop.speed.y * wall.length.y;
    const uSquared = wall.length.x**2 + wall.length.y**2;
    const scale = 2 * (dotProduct / uSquared);

    drop.speed.x = (scale * wall.length.x - drop.speed.x) * 0.5;
    drop.speed.y = (scale * wall.length.y - drop.speed.y) * 0.5;
    drop.position.x = drop.lastPosition.x + (factor - coreRadiusFactor) * movement.x;
    drop.position.y = drop.lastPosition.y + (factor - coreRadiusFactor) * movement.y;
};

const addPressure = (drop, pressurePosition, offset) => {
    const pressureVector = {
        x: pressurePosition.x - drop.position.x,
        y: pressurePosition.y - drop.position.y
    };
    const distance = Math.sqrt(pressureVector.x**2 + pressureVector.y**2);
    const pressureNormalized = Math.min((offset - distance) / (drop.softRadius - drop.coreRadius), 1.0);
    if (distance > 0.0 && pressureNormalized > 0.0) {
        drop.pressures.push({
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

const applyPressures = (drop) => {
    drop.pressures.forEach(pressure => {
        drop.force.x += pressure.x;
        drop.force.y += pressure.y;
    });
};

const applyForce = (drop, elapsedTime) => {
    drop.lastPosition.x = drop.position.x;
    drop.lastPosition.y = drop.position.y;

    drop.speed.x += drop.force.x * elapsedTime
    drop.speed.y += drop.force.y * elapsedTime

    drop.nextPosition.x = drop.position.x + drop.speed.x * meterInPixels;
    drop.nextPosition.y = drop.position.y + drop.speed.y * meterInPixels;

    drop.element.style.left = `${drop.nextPosition.x}px`;
    drop.element.style.top = `${drop.nextPosition.y}px`;
};

export default (level) => {
    const drops = [];

    const moveDrop = (drop) => {
        const currentTime = performance.now() / 1000.0;
        const elapsedTime = currentTime - drop.time;

        initializeDrop(drop);

        addGravity(drop);
        addAirResistance(drop);

        applyWallCollision(drop, level.walls);

        addWallPressures(drop, level.walls);
        addDropPressures(drop, drops);

        applyPressures(drop);

        applyForce(drop, elapsedTime);

        drop.time = currentTime;

        /*
        console.log('ElapsedTime', elapsedTime);
        console.log('MaxPressure', drop.maxPressure);
        console.log('Force', drop.force);
        console.log('Speed', drop.speed);*/

        window.setTimeout(() => moveDrop(drop), 50);
    };

    return {
        addDrop: (drop) => {
            drops.push(drop);
            moveDrop(drop);
        }
    }
}