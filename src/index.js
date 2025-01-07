// Importa el módulo express para crear la aplicación web.
const express = require('express');
// Crea una instancia de la aplicación Express.
const app = express();
// Importa el módulo mysql2 para conectarse a la base de datos MySQL.
app.use(express.json());
app.use(express.static('src'));

const encryptRoutes = require('./encryptRoutes.js');

app.use('/api', encryptRoutes);

// Establece el puerto en el que el servidor escuchará. Usa la variable de entorno PORT si está definida, o 3000 por defecto.
const port = process.env.PORT || 3001;
// Inicia el servidor y escucha en el puerto definido.
app.listen(port, () => {
    // Imprime un mensaje en la consola indicando que el servidor está corriendo.
    console.log(`Servidor corriendo en http://localhost:${port}`);
});