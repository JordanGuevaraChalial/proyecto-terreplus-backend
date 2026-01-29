const authJwt = require("../middleware/authJwt");
const controller = require("../controllers/history.controller");

module.exports = function(app) {
  // Ver historial de valoraciones del usuario logueado
  app.get(
    "/api/user/history",
    [authJwt.verifyToken],
    controller.obtenerHistorialUsuario
  );

  // Ver detalle de una valoración específica (incluyendo factores)
  app.get(
    "/api/user/history/:id",
    [authJwt.verifyToken],
    controller.obtenerDetalleConsulta
  );

  // Eliminar una consulta del historial
  app.delete(
    "/api/user/history/:id",
    [authJwt.verifyToken],
    controller.eliminarConsulta
  );
};