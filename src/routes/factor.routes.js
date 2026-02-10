const authJwt = require("../middleware/authJwt");
const factorController = require("../controllers/factor.controller");

module.exports = function(app) {
  app.get(
    "/api/factors",
    [authJwt.verifyToken],
    factorController.obtenerFactores
  );

  app.post(
    "/api/factors",
    [authJwt.verifyToken, authJwt.isAdmin],
    factorController.crearFactor
  );

  app.get(
    "/api/consultas/:consultaId/factors",
    [authJwt.verifyToken],
    factorController.obtenerFactoresDeConsulta
  );
};