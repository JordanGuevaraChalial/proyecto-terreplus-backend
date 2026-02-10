const { Consulta, Terrain, ModeloML, ConsultaFactor } = require('../models');
const pythonService = require('./python.service');

/**
 * Lógica central para estimar el valor de un terreno (RF-03)
 */
exports.estimarValor = async (terrenoId, modeloId, usuarioId) => {
  // 1. Obtener datos del terreno
  const terreno = await Terrain.findByPk(terrenoId);
  if (!terreno) throw new Error("Terreno no encontrado");

  // 2. Preparar datos para el modelo .pkl
  const datosParaIA = {
    area: terreno.area_hectareas,
    suelo: terreno.tipo_suelo,
    riego: terreno.acceso_riego ? 1 : 0,
    vias: terreno.proximidad_vias_km
  };

  // 3. Llamar al servicio que ejecuta Python
  const resultadoIA = await pythonService.ejecutarPrediccion(datosParaIA);

  // 4. Crear registro en el historial (Clase Consulta)
  const nuevaConsulta = await Consulta.create({
    usuario_id: usuarioId,
    terreno_id: terrenoId,
    modelo_ml_id: modeloId,
    fecha: new Date(),
    valor_estimado_hectarea: resultadoIA.valor,
    uso_recomendado: resultadoIA.recomendacion || "Cultivo optimizado",
    precision_modelo: resultadoIA.precision || 0.94,
    factores_csv: resultadoIA.factores || null
  });

  // 5. Asociación automática de los 5 factores principales (IDs 1 a 5)
  await ConsultaFactor.bulkCreate([
    {
      // Fertilidad del suelo
      consulta_id: nuevaConsulta.id,
      factor_id: 1,  
      valor: terreno.tipo_suelo === 'fertil' ? 'Alta' : (terreno.tipo_suelo === 'medio' ? 'Media' : 'Baja'),
      impacto: 0.35
    },
     // Acceso a riego
    {
      consulta_id: nuevaConsulta.id,
      factor_id: 2, 
      valor: terreno.acceso_riego ? 'Sí' : 'No',
      impacto: 0.25
    },
    // Proximidad a vías principales
    {
      consulta_id: nuevaConsulta.id,
      factor_id: 3,  
      valor: `${terreno.proximidad_vias_km} km`,
      impacto: 0.15
    },
     // Topografía plana (simulado, puedes agregar campo pendiente en terrenos)
    {
      consulta_id: nuevaConsulta.id,
      factor_id: 4, 
      valor: 'Media',
      impacto: 0.10
    },
    // Precipitación anual (simulado - puedes agregar campo en terrenos)
    {
      consulta_id: nuevaConsulta.id,
      factor_id: 5,  
      valor: 'Normal',
      impacto: 0.08
    }
  ]);

  return nuevaConsulta;
};