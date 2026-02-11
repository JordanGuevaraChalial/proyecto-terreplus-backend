const authJwt = require("../middleware/authJwt");
const controller = require("../controllers/terrain.controller");

module.exports = function(app) {
  // Crear un nuevo terreno (PostGIS)
  app.post(
    "/api/terrain",
    [authJwt.verifyToken],
    controller.crearTerreno
  );

  // Obtener terrenos del usuario actual
  app.get(
    "/api/terrain/my-list",
    [authJwt.verifyToken],
    controller.obtenerMisTerrenos
  );
  // Obtener todos los terrenos (públicos y privados del usuario)
  app.get(
    "/api/terrain/all",
    [authJwt.verifyToken],
    controller.obtenerTodosTerrenos
  );
};