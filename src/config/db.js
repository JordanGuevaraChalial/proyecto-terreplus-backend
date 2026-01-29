const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de la conexión
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: true,
    dialectOptions: {
      // Importante para asegurar compatibilidad con versiones de Postgres
      useUTC: false, 
    },
    define: {
      timestamps: true, 
      underscored: true, 
    }
  }
);

// Función para probar la conexión
const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Sequelize: Conexión establecida con PostgreSQL/PostGIS.');
  } catch (error) {
    console.error('❌ Sequelize: No se pudo conectar a la base de datos:', error);
  }
};

checkConnection();

module.exports = sequelize;