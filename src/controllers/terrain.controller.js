const { Terrain, Consulta } = require('../models');

exports.crearTerreno = async (req, res) => {
  try {
    const terreno = await Terrain.create({
      poligono: req.body.poligono, // Formato GeoJSON
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
    const terrenos = await Terrain.findAll({
      include: [{
        model: Consulta,
        where: { usuario_id: req.userId },  
        attributes: ['valor_estimado_hectarea', 'fecha'],
        limit: 1,
        order: [['fecha', 'DESC']]
      }],
      order: [['id', 'DESC']]
    });

    if (!terrenos || terrenos.length === 0) {
      return res.status(200).json({ 
        message: "No tienes terrenos registrados o consultados.", 
        data: [] 
      });
    }

    res.status(200).json(terrenos);
  } catch (error) {
    res.status(500).send({ message: "Error al obtener la lista de terrenos: " + error.message });
  }
};