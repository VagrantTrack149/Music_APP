const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openDirectoryDialog: () => ipcRenderer.invoke('open-directory-dialog'),
    readAudioFiles: (directoryPath) => ipcRenderer.invoke('read-audio-files', directoryPath),
});