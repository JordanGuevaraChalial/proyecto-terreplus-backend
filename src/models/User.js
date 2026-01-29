const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('Usuario', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
  nombre: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  rol: { 
    type: DataTypes.ENUM('inversionista', 'agricultor', 'admin_publico', 'admin_sistema'),
    allowNull: false 
  },
  fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'usuarios', timestamps: false });

// Método del Diagrama de Clases
User.prototype.esAdministrador = function() {
  return ['admin_publico', 'admin_sistema'].includes(this.rol);
};

module.exports = User;