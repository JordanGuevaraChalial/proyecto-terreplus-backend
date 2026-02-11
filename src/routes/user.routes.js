const authJwt = require("../middleware/authJwt");
const controller = require("../controllers/history.controller");
const userController = require("../controllers/user.controller"); 
const factorController = require("../controllers/factor.controller");
const authJwt = require("../middleware/authJwt");

module.exports = function(app) {
  // Rutas existentes de historial
  app.get(
    "/api/user/history",
    [authJwt.verifyToken],
    controller.obtenerHistorialUsuario
  );

  app.get(
    "/api/user/history/:id",
    [authJwt.verifyToken],
    controller.obtenerDetalleConsulta
  );

  app.delete(
    "/api/user/history/:id",
    [authJwt.verifyToken],
    controller.eliminarConsulta
  );

  //Actualizar perfil del usuario logueado
  app.put(
    "/api/user/profile",
    [authJwt.verifyToken],
    userController.actualizarPerfil
  );

  // Obtener datos del perfil actual (útil para mostrar en frontend)
  app.get(
    "/api/user/profile",
    [authJwt.verifyToken],
    userController.obtenerPerfil
  );
  app.get(
    '/api/consultas/:consultaId/factors', 
    [authJwt.verifyToken], 
    factorController.obtenerFactoresDeConsulta
  );
};