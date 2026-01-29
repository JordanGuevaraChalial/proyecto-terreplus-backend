const app = require('./app');
const { syncDatabase } = require('./models/index');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log('⏳ Iniciando conexión con la base de datos...');
    
    // 1. Sincronizar modelos con PostgreSQL + PostGIS (ERD a Tablas)
    // Usamos await para asegurar que la DB esté lista antes de aceptar peticiones
    await syncDatabase();
    
    // 2. Encender el servidor Express
    app.listen(PORT, () => {
      console.log(`SERVIDOR EJECUTÁNDOSE EN: http://localhost:${PORT}`);
      console.log(`Base de Datos: Sincronizada y Lista`);
    });

  } catch (error) {
    console.error('ERROR FATAL AL INICIAR EL SERVIDOR:');
    console.error(error.message);
    process.exit(1);
  }
};

// Ejecutar el arranque
startServer();