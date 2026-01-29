const { Consulta, Terrain, sequelize } = require('../models');

exports.obtenerEstadisticasZonas = async (req, res) => {
  try {
    // Ejemplo de consulta agrupada para el Mapa Interactivo
    const stats = await Consulta.findAll({
      attributes: [
        'uso_recomendado',
        [sequelize.fn('AVG', sequelize.col('valor_estimado_hectarea')), 'promedio_valor']
      ],
      group: ['uso_recomendado']
    });
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).send({ message: "Error al generar estadísticas." });
  }
};