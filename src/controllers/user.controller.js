const User = require('../models/User'); 
const bcrypt = require('bcryptjs');
exports.obtenerPerfil = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'email', 'nombre', 'rol', 'fecha_registro', 'foto_perfil']
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.actualizarPerfil = async (req, res) => {
  try {
    const { nombre, foto_perfil, password, passwordold } = req.body;

    // Solo permitimos actualizar nombre y foto_perfil (por seguridad)
    const updates = {};
    if (nombre !== undefined) updates.nombre = nombre;
    if (foto_perfil !== undefined) updates.foto_perfil = foto_perfil;

    if (password !== undefined && passwordold !== undefined) {
      const user = await User.findByPk(req.userId);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const isPasswordValid = await bcrypt.compare(passwordold, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Contraseña antigua incorrecta" });
      }

      updates.password = await bcrypt.hash(password, 12);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No se proporcionaron campos para actualizar" });
    }

    const [updated] = await User.update(updates, {
      where: { id: req.userId },
      returning: true
    });

    if (!updated) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const updatedUser = await User.findByPk(req.userId, {
      attributes: ['id', 'email', 'nombre', 'rol', 'fecha_registro', 'foto_perfil']
    });

    res.status(200).json({
      message: "Perfil actualizado correctamente",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};