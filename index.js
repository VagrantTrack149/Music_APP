const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { eventNames } = require('process');
const { json } = require('stream/consumers');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.loadFile('src/Views/Prueba.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

ipcMain.handle('open-directory-dialog', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory'], 
    });

    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0]; 
    }
    return null;
});

ipcMain.handle('read-audio-files', async (event, directoryPath) => {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return reject(`Error al leer el directorio: ${err.message}`);
            }

            const audioFiles = files.filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.mp3', '.wav', '.ogg', '.m4a'].includes(ext);
            });

            const fullPaths = audioFiles.map(file => path.join(directoryPath, file));
            resolve(fullPaths);
        });
    });
});
Default_dir="src/path.json"
ipcMain.handle('write-directory', async (event, directoryPath) => {
    return new Promise((resolve, reject) => {
        const data = {
            directory: directoryPath
        };

        const jsonData = JSON.stringify(data, null, 2);

        fs.writeFile(Default_dir, jsonData, (err) => {
            if (err) {
                return reject(`Error al guardar la dirección por defecto: ${err.message}`);
            }
            resolve('Ruta guardada correctamente en path.json');
        });
    });
});

ipcMain.handle('Read-directory', (event) => {
    try {
        const data = fs.readFileSync(Default_dir, 'utf-8');
        const jsonData = JSON.parse(data); 
        return jsonData; 
    } catch (err) {
        throw new Error('Error al leer la dirección por defecto: ' + err.message);
    }
});

ipcMain.handle('Read-Image', async (event, imgpath) => {
    try {
        // Verificar si la ruta de la imagen es válida
        if (!imgpath || typeof imgpath !== 'string') {
            throw new Error('La ruta de la imagen no es válida');
        }

        // Leer la imagen como un buffer
        const data = fs.readFileSync(imgpath);

        // Crear la carpeta si no existe
        const fontDir = path.join(__dirname, 'Static', 'Font');
        if (!fs.existsSync(fontDir)) {
            fs.mkdirSync(fontDir, { recursive: true });
        }

        // Guardar la imagen en la carpeta 'Static/Font'
        const fileName = path.basename(imgpath);
        const savepath = path.join(fontDir, fileName);
        fs.writeFileSync(savepath, data);

        // Devolver la ruta relativa de la imagen guardada
        return `Static/Font/${fileName}`;
    } catch (error) {
        console.error('Error al leer o guardar la imagen:', error);
        throw new Error('No se pudo leer o guardar la imagen');
    }
});




app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});
