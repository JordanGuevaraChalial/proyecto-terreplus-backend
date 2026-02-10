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
    // alter: true sincroniza cambios sin borrar datos si es posible
    await sequelize.sync({ alter: true });
    console.log("Modelos sincronizados con la DB (PostgreSQL + PostGIS)");
  } catch (error) {
    console.error("Error al sincronizar la base de datos:", error);
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