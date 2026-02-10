const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ConsultaFactor = sequelize.define('ConsultaFactor', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  consulta_id: { type: DataTypes.BIGINT, allowNull: false },
  factor_id: { type: DataTypes.BIGINT, allowNull: false },
  valor: { type: DataTypes.STRING(255), allowNull: true },      
  impacto: { type: DataTypes.DECIMAL(5, 4), allowNull: true }
}, {
  tableName: 'consulta_detalles_factor',
  timestamps: true
});

module.exports = ConsultaFactor;