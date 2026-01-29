const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Factor = sequelize.define('Factor', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    peso_actual: { type: DataTypes.DECIMAL(5, 4), allowNull: false },
    descripcion: { type: DataTypes.TEXT },
    categoria: {
        type: DataTypes.ENUM('ambiental', 'infraestructura', 'suelo'),
        allowNull: false
    }
}, { tableName: 'factores_influencia', timestamps: false });

module.exports = Factor;