const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Si existe DATABASE_URL (Caso Railway)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      timestamps: true,
      underscored: true,
    }
  });
} else {
  // Si NO existe (Caso Local) usa las variables individuales
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: true,
      define: {
        timestamps: true,
        underscored: true,
      }
    }
  );
}

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