const path = 'D:/Documentos/JustMusic/src/Font/boton-de-play.png';

async function loadAudioFiles(directory) {
    const audioFiles = await window.electronAPI.readAudioFiles(directory);
    const musicList = document.getElementById('music-list');

    musicList.innerHTML = ''; 

    audioFiles.forEach(file => {
        const row = document.createElement('tr');
        const fileName = file.split('\\').pop();

        const colElemento = document.createElement('td');
        colElemento.className = 'columna-1 Elemento';
        colElemento.textContent = fileName;
        colElemento.id = fileName;

        const colDuracion = document.createElement('td');
        colDuracion.className = 'columna-2 Duracion';
        colDuracion.textContent = '...'; 
        colDuracion.id = fileName;

        const colPlay = document.createElement('td');
        colPlay.className = 'columna-3 Play';
        colPlay.id = fileName;
        colPlay.innerHTML = '▶️'; 

        row.appendChild(colElemento);
        row.appendChild(colDuracion);
        row.appendChild(colPlay);

        musicList.appendChild(row);

        const audio = new Audio(file);
        audio.addEventListener('loadedmetadata', () => {
            const duration = audio.duration;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            colDuracion.textContent = formattedDuration; 
        });

        audio.addEventListener('error', (err) => {
            console.error(`Error al cargar el archivo ${fileName}:`, err);
            colDuracion.textContent = 'Error';
        });
    });
}

window.electronAPI.ReadDir().then((data) => {
        const dirDefault = data.directory;
        console.log('Directorio leído:', dirDefault); 

        if (dirDefault != null) { 
            loadAudioFiles(dirDefault); 
        }
    })
    .catch((error) => {
        console.error(error); 
    });

document.getElementById('select-directory').addEventListener('click', async () => {
    try {
        const directoryPath = await window.electronAPI.openDirectoryDialog();
        await window.electronAPI.WriteDefaultDir(directoryPath);

        if (directoryPath) {
            await loadAudioFiles(directoryPath); 
        }
    } catch (error) {
        console.error(error);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const musicList = document.getElementById('music-list');

    musicList.addEventListener('click', (event) => {
        const playButton = event.target.closest('.Play');
        console.log(playButton)
        if (playButton) {
            try {
                console.log("Click");
                const fileName = playButton.id;
                console.log(fileName);

                if (!fileName) {
                    console.error('No se encontró el nombre del archivo.');
                    return;
                }
                window.electronAPI.ReadDir().then((data) => {
                    const dirDefault = data.directory;
                    console.log('Directorio leído:', dirDefault); 
            
                    if (dirDefault != null) { 
                        const fileURL = dirDefault + '/' + fileName;
                        console.log(fileURL);
        
                        const audio = document.getElementById('audio');
                        const source = document.getElementById('audioSource');
        
                        source.src = fileURL;
                        audio.load();
                        audio.play();
                    }
                })
                .catch((error) => {
                    console.error(error); 
                });
            } catch (error) {
                console.error('Error al reproducir el audio:', error);
            }
        }
    });
});