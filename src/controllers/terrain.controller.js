const { Terrain, Consulta } = require('../models');
const { Op, literal } = require('sequelize');

exports.crearTerreno = async (req, res) => {
  try {
    const terreno = await Terrain.create({
      poligono: req.body.poligono,
      area_hectareas: req.body.area_hectareas,
      tipo_suelo: req.body.tipo_suelo,
      acceso_riego: req.body.acceso_riego,
      proximidad_vias_km: req.body.proximidad_vias_km,
      ubicacion_nombre: req.body.ubicacion_nombre,
      coordenadas: { type: 'Point', coordinates: [req.body.lng, req.body.lat] }
    });
    res.status(201).json(terreno);
  } catch (error) {
    res.status(500).send({ message: "Error al registrar el terreno." });
  }
};

exports.obtenerMisTerrenos = async (req, res) => {
  try {
    // Filtro por terrenos que el usuario ya consultó/estimó
    const terrenos = await Terrain.findAll({
      where: {
        id: {
          [Op.in]: literal(`(SELECT DISTINCT terreno_id FROM consultas WHERE usuario_id = ${req.userId})`)
        }
      },
      include: [{
        model: Consulta,
        attributes: ['valor_estimado_hectarea', 'fecha'],
        limit: 1,
        order: [['fecha', 'DESC']]
      }],
      order: [['id', 'DESC']]
    });

    if (terrenos.length === 0) {
      return res.status(200).json({ 
        message: "No tienes terrenos registrados o consultados.", 
        data: [] 
      });
    }

    res.status(200).json(terrenos);
  } catch (error) {
    console.error('Error al obtener mis terrenos:', error);
    res.status(500).json({ message: "Error al obtener la lista de terrenos: " + error.message });
  }
};