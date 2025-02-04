const fs = require("fs")
const path= require("path")
function Leer_Audio_Files(Direccion, extensiones=[".mp3",".wav",".ogg","m4a"]) {
    return new Promise((resolve, reject)=> {
        fs.readdir(Direccion,(err, files)=> {
            if (err) {
                return reject("Error al leer el directorio: "+err.message)
            }
            const AudioFile=files.filter(file=>{
                const ext = path.extname(file).toLowerCase();
                return audioExtensions.includes(ext)
            })
            const fullPaths = audioFiles.map(file => path.join(directoryPath, file));
            resolve(fullPaths);
        })
    })    
}
