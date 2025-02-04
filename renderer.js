const path = "D:/Documentos/JustMusic/src/Font/boton-de-play.png";

document.getElementById('select-directory').addEventListener('click', async () => {
    try {
        const directoryPath = await window.electronAPI.openDirectoryDialog();

        if (directoryPath) {
            const audioFiles = await window.electronAPI.readAudioFiles(directoryPath);
            const musicList = document.getElementById('music-list');

            musicList.innerHTML = '';

            audioFiles.forEach(file => {
                const li = document.createElement('li');
                
                 const fileName = file.split('\\').pop();
                li.textContent = fileName;
                li.innerHTML= fileName + "<img src="+path+" style='height: 50px;'>";
                musicList.appendChild(li);
            });
        }
    } catch (error) {
        console.error(error);
    }
});