const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Ejecuta el script de Python de manera robusta para producción (Railway)
 */
exports.ejecutarPrediccion = (datos) => {
  return new Promise((resolve, reject) => {

    // 1. DEFINICIÓN DE RUTAS ABSOLUTAS
    // Aseguramos que la ruta sea correcta desde la raíz del proyecto
    const scriptPath = path.resolve(__dirname, '../../ml/predict_bridge.py');

    // 2. DIAGNÓSTICO (Esto aparecerá en los logs de Railway)
    console.log(`[ML Service] Buscando script en: ${scriptPath}`);

    if (!fs.existsSync(scriptPath)) {
      console.error(`[ML ERROR] CRÍTICO: No se encuentra el archivo .py en ${scriptPath}`);
      return reject(new Error("El archivo del modelo de IA no existe en el servidor."));
    }

    // 3. COMANDO DE EJECUCIÓN
    // Usamos 'python3' directamente ya que configuramos Nixpacks para Linux
    const pythonCommand = 'python3';

    // NO pasamos los datos como argumentos, solo el script
    const pythonProcess = spawn(pythonCommand, [scriptPath]);

    let dataString = '';
    let errorString = '';

    // 4. ENVÍO DE DATOS SEGURO (STDIN)
    // Escribimos el JSON directamente en la entrada del proceso Python
    pythonProcess.stdin.write(JSON.stringify(datos));
    pythonProcess.stdin.end(); // Importante: cerramos la entrada para que Python sepa que terminamos

    // 5. CAPTURA DE SALIDA
    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorString += data.toString();
      // Opcional: ver los warnings en el log de Railway
      console.warn(`[ML PYTHON LOG]: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      console.log(`[ML Service] Proceso Python terminó con código: ${code}`);

      if (code !== 0) {
        console.error(`[ML ERROR] Salida de error: ${errorString}`);
        return reject(new Error(`Error al ejecutar el modelo. Código: ${code}`));
      }

      try {
        // 6. LIMPIEZA DE RESPUESTA (Vital para evitar errores de parseo)
        // A veces Python imprime logs antes del JSON. Buscamos el primer '{' y el último '}'
        const firstBracket = dataString.indexOf('{');
        const lastBracket = dataString.lastIndexOf('}');

        if (firstBracket === -1 || lastBracket === -1) {
          throw new Error("La respuesta de Python no contiene un JSON válido.");
        }

        const cleanJson = dataString.substring(firstBracket, lastBracket + 1);
        const result = JSON.parse(cleanJson);
        resolve(result);

      } catch (e) {
        console.error(`[ML PARSE ERROR] No se pudo parsear: ${dataString}`);
        return reject(new Error("La IA devolvió una respuesta inválida."));
      }
    });
  });
};