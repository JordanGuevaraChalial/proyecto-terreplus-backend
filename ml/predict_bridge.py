import sys
import json
import joblib
import os
import pandas as pd

def main():
    try:
        # 1. Leer los datos enviados por Node.js desde los argumentos
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No se recibieron datos"}))
            return

        input_data = json.loads(sys.argv[1])
        
        # 2. Cargar el modelo .pkl
        # Asegúrate de que el nombre del archivo coincida con el tuyo
        model_path = os.path.join(os.path.dirname(__file__), 'modelo_valoracion.pkl')
        
        if not os.path.exists(model_path):
            # Si no existe el pkl, devolvemos un valor simulado para no romper el flujo
            # pero avisamos en el log
            resultado = {
                "valor": float(input_data['area']) * 1100, # Lógica simple de respaldo
                "recomendacion": "Validar archivo .pkl",
                "status": "warning"
            }
        else:
            model = joblib.load(model_path)
            
            # 3. Preparar el DataFrame para la predicción
            # Los nombres de las columnas deben ser iguales a como entrenaste el modelo
            df = pd.DataFrame([input_data])
            
            # 4. Realizar la predicción
            prediccion = model.predict(df)
            
            resultado = {
                "valor": round(float(prediccion[0]), 2),
                "recomendacion": "Cultivo optimizado según modelo IA",
                "status": "success"
            }

        # 5. Devolver el resultado a Node.js vía STDOUT
        print(json.dumps(resultado))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()