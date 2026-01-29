const { Consulta, Factor } = require('../models');

exports.generarReporteCSV = async (consultaId) => {
  const consulta = await Consulta.findByPk(consultaId, {
    include: [{ model: Factor }]
  });

  if (!consulta) throw new Error("Consulta no encontrada");

  // Crear cabecera y filas para un CSV simple
  let csvContent = "Factor,Peso,Categoria,Valor\n";
  
  consulta.Factors.forEach(f => {
    csvContent += `${f.nombre},${f.peso_actual},${f.categoria},${f.valor_referencia || 'N/A'}\n`;
  });

  return csvContent;
};

exports.obtenerResumenZonas = async () => {
  const { Terrain, Consulta, sequelize } = require('../models');
  
  // Esta consulta agrupa los terrenos por zona y saca el promedio de valor
  return await Consulta.findAll({
    attributes: [
      [sequelize.col('Terreno.ubicacion_nombre'), 'zona'],
      [sequelize.fn('AVG', sequelize.col('valor_estimado_hectarea')), 'precio_promedio'],
      [sequelize.fn('COUNT', sequelize.col('Consulta.id')), 'total_consultas']
    ],
    include: [{
      model: Terrain,
      attributes: [] 
    }],
    group: ['Terreno.ubicacion_nombre'],
    raw: true
  });
};