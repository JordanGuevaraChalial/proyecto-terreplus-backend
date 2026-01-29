const { Consulta, Terrain, ModeloML } = require('../models');

// Obtener todas las consultas del usuario logueado
exports.obtenerHistorialUsuario = async (req, res) => {
  try {
    const historial = await Consulta.findAll({
      where: { usuario_id: req.userId }, // req.userId viene del middleware authJwt
      include: [
        {
          model: Terrain,
          attributes: ['ubicacion_nombre', 'area_hectareas', 'tipo_suelo']
        },
        {
          model: ModeloML,
          attributes: ['version']
        }
      ],
      order: [['fecha', 'DESC']] // Ver primero las más recientes
    });

    if (!historial || historial.length === 0) {
      return res.status(200).json({ message: "No tienes consultas registradas aún.", data: [] });
    }

    res.status(200).json(historial);
  } catch (error) {
    res.status(500).send({ message: "Error al recuperar el historial: " + error.message });
  }
};

// Obtener el detalle de una consulta específica (incluyendo factores)
exports.obtenerDetalleConsulta = async (req, res) => {
  try {
    const consulta = await Consulta.findOne({
      where: { 
        id: req.params.id,
        usuario_id: req.userId // Seguridad: solo el dueño puede verla
      },
      include: ['Factors'] // Incluye los factores de influencia asociados
    });

    if (!consulta) {
      return res.status(404).send({ message: "Consulta no encontrada o acceso denegado." });
    }

    res.status(200).json(consulta);
  } catch (error) {
    res.status(500).send({ message: "Error al obtener el detalle." });
  }
};

// Eliminar una consulta del historial
exports.eliminarConsulta = async (req, res) => {
  try {
    const eliminada = await Consulta.destroy({
      where: { 
        id: req.params.id,
        usuario_id: req.userId 
      }
    });

    if (eliminada) {
      res.status(200).send({ message: "Consulta eliminada del historial." });
    } else {
      res.status(404).send({ message: "No se pudo eliminar: la consulta no existe." });
    }
  } catch (error) {
    res.status(500).send({ message: "Error en el servidor al intentar eliminar." });
  }
};