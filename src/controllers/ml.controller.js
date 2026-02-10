const { Consulta, Terrain, ModeloML } = require('../models');
const estimationService = require('../services/estimacion.service');

exports.estimarValor = async (req, res) => {
  try {
    const { terreno_id, modelo_id = 1 } = req.body;

    if (!terreno_id) {
      return res.status(400).json({ message: "terreno_id es obligatorio" });
    }

    const terreno = await Terrain.findByPk(terreno_id);
    if (!terreno) {
      return res.status(404).json({ message: "Terreno no encontrado" });
    }

    // Comentamos o eliminamos la validación para permitir la primera estimación
    /*
    const consultaExistente = await Consulta.findOne({
      where: {
        usuario_id: req.userId,
        terreno_id: terreno_id
      }
    });

    if (!consultaExistente) {
      return res.status(403).json({ 
        message: "Este terreno no te pertenece o aún no lo has consultado" 
      });
    }
    */

    // Proceder con la estimación real
    const nuevaConsulta = await estimationService.estimarValor(
      terreno_id,
      modelo_id,
      req.userId
    );

    res.status(200).json(nuevaConsulta);

  } catch (error) {
    console.error('ERROR en estimarValor:', error.message, error.stack);
    res.status(500).json({ 
      message: "Error al procesar la estimación IA", 
      error: error.message 
    });
  }
};