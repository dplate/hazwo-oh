const svgNamespace = 'http://www.w3.org/2000/svg';

export default (level) => {
    const debugLayer = document.createElementNS(svgNamespace,'svg');
    debugLayer.style.position = 'absolute';
    debugLayer.style.width = '100%'
    debugLayer.style.height = '100%';
    debugLayer.setAttribute('viewbox',`0 0 ${level.width} ${level.height}`);

    level.walls.forEach(wall => {
        const line = document.createElementNS(svgNamespace,'line');
        line.setAttribute('x1', wall.from.x);
        line.setAttribute('y1', wall.from.y);
        line.setAttribute('x2', wall.to.x);
        line.setAttribute('y2', wall.to.y);
        line.style.stroke = 'red';
        line.style.lineWidth = '2px';
        debugLayer.appendChild(line);
    });

    return debugLayer;
}