const { Sequelize } = require('sequelize');
require('dotenv').config();

// Railway suele proporcionar DATABASE_URL. Es más limpio usarla directamente.
const sequelize = new Sequelize(process.env.DATABASE_URL || {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
}, {
    logging: false, // Cambiar a true si necesitas debuguear
    dialectOptions: {
      useUTC: false,
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false // Crucial para Railway
      } : false
    },
    define: {
      timestamps: true,
      underscored: true,
    }
});

const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Sequelize: Conexión establecida correctamente.');
  } catch (error) {
    console.error('❌ Sequelize: Error de conexión:', error);
  }
};

checkConnection();

module.exports = sequelize;