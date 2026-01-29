const { Consulta, Terrain, ModeloML } = require('../models');
// Aquí importarías el servicio de Python más adelante

exports.estimarValor = async (req, res) => {
  try {
    const { terreno_id, modelo_id } = req.body;

    // 1. Buscar datos del terreno
    const terreno = await Terrain.findByPk(terreno_id);
    
    // 2. Aquí llamarías a python.service.js para obtener la predicción real
    const valorSimulado = 5500.25; // Simulación mientras conectamos el .pkl

    // 3. Crear la Consulta (Historial) según el UML
    const nuevaConsulta = await Consulta.create({
      usuario_id: req.userId,
      terreno_id: terreno.id,
      modelo_ml_id: modelo_id,
      valor_estimado_hectarea: valorSimulado,
      uso_recomendado: "Cultivo de ciclo corto",
      precision_modelo: 0.94
    });

    res.status(200).json(nuevaConsulta);
  } catch (error) {
    res.status(500).send({ message: "Error al procesar la estimación IA." });
  }
};