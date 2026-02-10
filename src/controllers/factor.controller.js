const { Factor, Consulta, ConsultaFactor } = require('../models');

exports.obtenerFactores = async (req, res) => {
  try {
    const factores = await Factor.findAll();
    res.status(200).json(factores);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener factores", error: error.message });
  }
};

exports.crearFactor = async (req, res) => {
  try {
    const { nombre, peso_actual, descripcion, categoria } = req.body;

    const nuevoFactor = await Factor.create({
      nombre,
      peso_actual,
      descripcion,
      categoria
    });

    res.status(201).json(nuevoFactor);
  } catch (error) {
    res.status(500).json({ message: "Error al crear factor", error: error.message });
  }
};

exports.asociarFactoresAConsulta = async (consultaId, factoresData) => {
  try {
    for (const factor of factoresData) {
      await ConsultaFactor.create({
        consulta_id: consultaId,
        factor_id: factor.factor_id,
        valor: factor.valor,
        impacto: factor.impacto
      });
    }
  } catch (error) {
    console.error('Error al asociar factores:', error);
  }
};

exports.obtenerFactoresDeConsulta = async (req, res) => {
  try {
    const { consultaId } = req.params;

    const factores = await ConsultaFactor.findAll({
      where: { consulta_id: consultaId },
      include: [{ model: Factor, attributes: ['nombre', 'peso_actual', 'categoria'] }]
    });

    res.status(200).json(factores);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener factores", error: error.message });
  }
};