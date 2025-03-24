export default (position) => {
    const element = document.createElement('img');
    element.src = './assets/images/drop.svg';
    element.style.position = 'absolute';
    element.style.left = `${position.x}px`;
    element.style.top = `${position.y}px`;
    element.style.transform = 'translate(-50%, -50%)';
    element.style.width = '50px';
    element.style.transition = 'left 1s, top 1s';

    return {
        position,
        nextPosition: { ...position },
        speed: {
            x: 0,
            y: 0
        },
        time: performance.now(),
        element
    };
}