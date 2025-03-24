import createDrop from './createDrop.js';
import createDebugLayer from './createDebugLayer.js';
import createPhysics from './createPhysics.js';

export default async (level) => {
    const physics = createPhysics(level);

    document.body.innerHTML = '';

    const view = document.createElement('div');
    view.style.position = 'absolute';
    view.style.width = '100%';
    view.style.height = '100%';
    view.style.overflow = 'auto';

    const playField = document.createElement('div');
    playField.style.position = 'absolute';
    playField.style.width = `${level.width}px`;
    playField.style.height = `${level.height}px`;
    playField.style.backgroundColor = 'lightblue';
    playField.style.overflow = 'hidden';
    playField.onclick = (event) => {
        const position = {
            x: event.target.scrollLeft + event.offsetX,
            y: event.target.scrollTop + event.offsetY
        }
        const drop = createDrop(position);
        playField.appendChild(drop.element);
        physics.addDrop(drop);
    }
    playField.appendChild(createDebugLayer(level))
    view.appendChild(playField);

    document.body.appendChild(view);
}