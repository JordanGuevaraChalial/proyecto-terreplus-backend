const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/auth.config');

exports.registrar = async (req, res) => {
  try {
    const user = await User.create({
      nombre: req.body.nombre,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      rol: req.body.rol
    });
    res.status(201).send({ message: "¡Usuario registrado exitosamente!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(404).send({ message: "Usuario no encontrado." });

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ accessToken: null, message: "Contraseña incorrecta." });

    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: config.jwtExpiration });

    res.status(200).send({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};