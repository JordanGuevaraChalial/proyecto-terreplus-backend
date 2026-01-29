const authJwt = require("../middleware/authJwt");
const controller = require("../controllers/ml.controller");

module.exports = function(app) {
  // Solicitar nueva estimación de valor al modelo .pkl
  app.post(
    "/api/ml/estimate",
    [authJwt.verifyToken],
    controller.estimarValor
  );

  // Obtener estadísticas para el Mapa Interactivo (DashboardService en UML)
  app.get(
    "/api/ml/stats-zones",
    [authJwt.verifyToken],
    require("../controllers/dashboard.controller").obtenerEstadisticasZonas
  );
};