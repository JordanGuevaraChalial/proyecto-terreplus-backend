const sequelize = require('../config/db');
const User = require('./User');
const Terrain = require('./Terrain');
const ModeloML = require('./ModeloML');
const Factor = require('./Factor');
const Consulta = require('./Consulta');
const ConsultaFactor = require('./ConsultaFactor');

// 1. Un Usuario realiza muchas Consultas
User.hasMany(Consulta, { foreignKey: 'usuario_id', as: 'mis_consultas' });
Consulta.belongsTo(User, { foreignKey: 'usuario_id' });

// 2. Un Terreno se evalúa en muchas Consultas
Terrain.hasMany(Consulta, { foreignKey: 'terreno_id' });
Consulta.belongsTo(Terrain, { foreignKey: 'terreno_id' });

// 3. Una Consulta utiliza un ModeloML específico
ModeloML.hasMany(Consulta, { foreignKey: 'modelo_ml_id' });
Consulta.belongsTo(ModeloML, { foreignKey: 'modelo_ml_id' });

// 4. Una Consulta detalla varios Factores (Relación Muchos a Muchos con tabla intermedia)
Consulta.belongsToMany(Factor, { 
  through: ConsultaFactor,
  foreignKey: 'consulta_id',
  otherKey: 'factor_id'
});

Factor.belongsToMany(Consulta, { 
  through: ConsultaFactor,
  foreignKey: 'factor_id',
  otherKey: 'consulta_id'
});

const syncDatabase = async () => {
  try {
    // 1. Activamos PostGIS (Esto soluciona el error de type "geometry")
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    console.log('🌍 PostGIS: Extensión verificada/activada.');

    // 2. Sincronizamos las tablas
    // Usamos { alter: true } para que actualice las tablas existentes sin borrarlas
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas correctamente.');
  } catch (error) {
    console.error('❌ Error en syncDatabase:', error.message);
    throw error; // Es importante lanzar el error para que el servidor no finja que todo está bien
  }
};

module.exports = {
  User,
  Terrain,
  ModeloML,
  Factor,
  Consulta,
  ConsultaFactor,
  syncDatabase,
  sequelize
};