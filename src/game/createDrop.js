export default (position) => {
    const element = document.createElement('img');
    element.src = './assets/images/drop.svg';
    element.style.position = 'absolute';
    element.style.left = `${position.x}px`;
    element.style.top = `${position.y}px`;
    element.style.transform = 'translate(-50%, -50%)';
    element.style.width = '50px';
    element.style.transition = 'left 1s linear, top 1s linear';

    return {
        position,
        forces: [],
        speed: {
            x: 10,
            y: -5
        },
        time: performance.now() / 1000.0,
        coreRadius: 10.0,
        softRadius: 25.0,
        adhesiveness: 5.0,
        elasticity: 40.0,
        element
    };
}