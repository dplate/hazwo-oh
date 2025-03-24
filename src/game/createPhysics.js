const addGravity = (speed, elapsedTime) => {
  speed.y += 9.81 * elapsedTime;
};

export default (level) => {
    const drops = [];

    const moveDrop = (drop) => {
        drop.position.x = drop.element.offsetParent.scrollTop + drop.element.offsetLeft
        drop.position.y = drop.element.offsetParent.scrollLeft + drop.element.offsetTop;
        console.log(drop.position);

        const elapsedTime = performance.now() - drop.time;
        addGravity(drop.speed, elapsedTime);

        drop.nextPosition.x = drop.position.x + drop.speed.x;
        drop.nextPosition.y = drop.position.y + drop.speed.y;

        drop.element.style.left = `${drop.nextPosition.x}px`;
        drop.element.style.top = `${drop.nextPosition.y}px`;

        window.setTimeout(() => moveDrop(drop), 100);
    };

    return {
        addDrop: (drop) => {
            drops.push(drop);
            moveDrop(drop);
        }
    }
}