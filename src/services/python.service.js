const { spawn } = require('child_process');
const path = require('path');

/**
 * Ejecuta el script de Python que carga el modelo de Machine Learning
 */
exports.ejecutarPrediccion = (datos) => {
  return new Promise((resolve, reject) => {
    // Ruta al script de integración con el modelo .pkl
    const scriptPath = path.join(__dirname, '../../ml/predict_bridge.py');

    // Detectar comando según sistema operativo (Railway usa Linux -> python3)
    const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';

    const pythonProcess = spawn(pythonCommand, [scriptPath, JSON.stringify(datos)]);

    let output = "";
    pythonProcess.stdout.on('data', (data) => output += data.toString());

    pythonProcess.stderr.on('data', (data) => console.error(`IA Error: ${data}`));

    pythonProcess.on('close', (code) => {
      if (code !== 0) return reject("Error en la ejecución del modelo ML");
      try {
        resolve(JSON.parse(output));
      } catch (e) {
        reject("Error al procesar respuesta de la IA");
      }
    });
  });
};