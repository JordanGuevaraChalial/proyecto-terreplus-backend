const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Consulta = sequelize.define('Consulta', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  valor_estimado_hectarea: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  uso_recomendado: { type: DataTypes.STRING },
  precision_modelo: { type: DataTypes.DECIMAL(5, 4) },
  factores_csv: { type: DataTypes.TEXT } 
}, { tableName: 'consultas', timestamps: false });

module.exports = Consulta;