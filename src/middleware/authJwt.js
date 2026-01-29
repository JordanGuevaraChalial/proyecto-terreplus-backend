const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const { User } = require("../models");

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "¡No se proporcionó un token!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "¡No autorizado! Token inválido o expirado." });
    }
    // Guardamos el ID del usuario en el request para que lo usen los controllers
    req.userId = decoded.id;
    next();
  });
};

// Método para validar si es Administrador (según tu UML esAdministrador())
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (user.rol === "admin_sistema" || user.rol === "admin_publico") {
      next();
      return;
    }
    res.status(403).send({ message: "¡Requiere rol de Administrador!" });
  } catch (error) {
    res.status(500).send({ message: "Error al verificar rol de usuario." });
  }
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin
};

module.exports = authJwt;