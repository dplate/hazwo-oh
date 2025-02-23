export default async () => {
    document.body.innerHTML = '';

    const playField = document.createElement('div');
    playField.style.backgroundColor = 'lightblue';
    playField.style.width = '100%';
    playField.style.height = '100%';
    document.body.appendChild(playField);

    const drop = document.createElement('img');
    drop.src = './assets/images/drop.svg';
    drop.style.position = 'absolute';
    drop.style.left = '50%';
    drop.style.top = '50%';
    drop.style.transform = 'translate(-50%, -50%)';
    drop.style.width = '100px';
    playField.appendChild(drop);

}