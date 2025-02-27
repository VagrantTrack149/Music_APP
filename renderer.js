
async function loadAudioFiles(directory) {
    const audioFiles = await window.electronAPI.readAudioFiles(directory);
    const musicList = document.getElementById('music-list');
    var numero= 0;
    musicList.innerHTML = ''; 

    audioFiles.forEach(file => {
        numero+=1;
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
        colPlay.innerHTML = '<div class="play-pause-container"><input type="checkbox" id="play-pause-'+numero+'" class="play-pause-checkbox"><label for="play-pause-'+numero+'" class="play-pause-button"></label></div>'; 

        row.appendChild(colElemento);
        row.appendChild(colDuracion);
        row.appendChild(colPlay);

        musicList.appendChild(row);
        const checkbox = colPlay.querySelector('.play-pause-checkbox');
        const PlayPauseButton= colPlay.querySelector('.play-pause-button');

        checkbox.addEventListener('change', () => {
        const ConAudio = document.getElementById('audio');
        const Source_audio= document.getElementById('audioSource');
        if (checkbox.checked) {
            Source_audio.src=file;
            ConAudio.load();
            ConAudio.play();
        }else{
            ConAudio.pause();
        }
        document.querySelectorAll('.play-pause-checkbox').forEach(otherCheckbox => {
            if (otherCheckbox !== checkbox) {
                otherCheckbox.checked = false;
            }
        });
        
        Source_sucia=Source_audio.src;
        Source_clean=Source_sucia.replace("file:///","");
        Source_clean_1=Source_clean.replace(/\//g,"\\");
        Source_clean_2=Source_clean_1.replace(/%20/g,' ');

        console.log(Source_clean_2);
        console.log(file);
        
        // Escuchar eventos del reproductor de audio
        ConAudio.addEventListener('play', () => {
            
            
            if (Source_clean_2==file) {
                checkbox.checked = true;
                console.log("Play");
            }
        });

        ConAudio.addEventListener('pause', () => {
            if (Source_clean_2==file) {
                checkbox.checked = false;
                console.log("Pause");    
            }
        });

        ConAudio.addEventListener('ended', () => {
            if (Source_clean_2==file) {
                checkbox.checked = false;
                console.log("Final");
            }
        });

    });
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

/*
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
                        console.log(fileName)
                        document.getElementById('Nombre-song').innerHTML=fileName
                        document.getElementById('Titulo').innerHTML='Just Music'+'-'+fileName
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

*/
window.addEventListener('load', function() {
    setTimeout(function(){
        document.getElementById('loader').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    },1000);
});