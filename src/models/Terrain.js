const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Terrain = sequelize.define('Terreno', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  poligono: { type: DataTypes.GEOMETRY('POLYGON', 4326), allowNull: false },
  area_hectareas: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  tipo_suelo: { type: DataTypes.STRING },
  acceso_riego: { type: DataTypes.BOOLEAN, defaultValue: false },
  proximidad_vias_km: { type: DataTypes.DECIMAL(10, 2) },
  ubicacion_nombre: { type: DataTypes.STRING },
  coordenadas: { type: DataTypes.GEOMETRY('POINT', 4326) }
}, { tableName: 'terrenos', timestamps: false });

module.exports = Terrain;