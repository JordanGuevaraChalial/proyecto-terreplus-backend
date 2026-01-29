const verifySignup = require("../middleware/verifySignup");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  // Registro de nuevo usuario (agricultor, inversionista, etc.)
  app.post("/api/auth/signup", [verifySignup.checkDuplicateEmail], controller.registrar);

  // Inicio de sesión
  app.post("/api/auth/signin", controller.login);
};