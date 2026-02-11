const { User } = require("../models");

const checkDuplicateEmail = async (req, res, next) => {
  try {
    // Verificar si el email ya existe en la tabla Usuarios
    const user = await User.findOne({
      where: { email: req.body.email }
    });

    if (user) {
      return res.status(400).send({ message: "¡Error! El correo electrónico ya está en uso." });
    }

    next();
  } catch (error) {
    res.status(500).send({ message: error.message});
  }
};

// Opcional: Validar que el rol enviado exista en el ENUM de tu base de datos
const checkRolesExisted = (req, res, next) => {
  const roles = ['inversionista', 'agricultor', 'admin_publico', 'admin_sistema'];
  if (req.body.rol) {
    if (!roles.includes(req.body.rol)) {
      return res.status(400).send({
        message: `¡Error! El rol '${req.body.rol}' no existe.`
      });
    }
  }
  next();
};

const verifySignup = {
  checkDuplicateEmail: checkDuplicateEmail,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignup;