document.getElementById('imageInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        try {
            // Leer y guardar la imagen
            const imagePath = await window.electronAPI.readImage(file.path);

            // Mostrar la imagen en el elemento <img>
            document.getElementById('preview').src = imagePath;
        } catch (error) {
            console.error('Error:', error);
        }
    }
});