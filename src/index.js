const app = require('./app');
const { syncDatabase } = require('./models/index');
require('dotenv').config();

// Solo definimos el puerto una vez
const PORT = process.env.PORT || 8080; 

const startServer = async () => {
  try {
    
    // 1. Sincronizar la base de datos (PostGIS)
    // Es vital que esto pase antes de que el servidor escuche peticiones
    await syncDatabase();
    console.log('Base de Datos: Sincronizada y Lista');

    // 2. Encender el servidor Express (UNA SOLA VEZ)
    // Usamos "0.0.0.0" para que sea accesible externamente en Railway
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`SERVIDOR EJECUTÁNDOSE EN EL PUERTO: ${PORT}`);
      console.log(`Región configurada: Ciudades y campos de Ecuador`);
    });

  } catch (error) {
    console.error('ERROR FATAL AL INICIAR EL SERVIDOR:');
    console.error(error.message);
    // En producción, si la DB falla, el proceso debe cerrarse
    process.exit(1);
  }
};

// Arrancamos el proceso
startServer();