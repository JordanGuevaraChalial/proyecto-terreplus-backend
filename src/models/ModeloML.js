const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ModeloML = sequelize.define('ModeloML', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  version: { type: DataTypes.STRING, allowNull: false },
  fecha_entrenamiento: { type: DataTypes.DATE },
  precision_global: { type: DataTypes.DECIMAL(5, 4) },
  ruta_archivo: { type: DataTypes.STRING, allowNull: false },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  parametros: { type: DataTypes.TEXT }
}, { tableName: 'modelos_ml', timestamps: false });

module.exports = ModeloML;