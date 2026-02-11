const authJwt = require("../middleware/authJwt");
const dashboardController = require("../controllers/dashboard.controller");

module.exports = function(app) {
  app.get(
    "/api/dashboard/estadisticas",
    [authJwt.verifyToken],
    dashboardController.obtenerDashboard
  );
};