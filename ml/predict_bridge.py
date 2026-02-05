import sys
import json
import joblib
import os
import pandas as pd

def main():
    try:
        # 1. Leer los datos enviados por Node.js (desde argumentos)
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No se recibieron datos"}))
            return

        input_data = json.loads(sys.argv[1])

        # 2. Cargar el modelo .pkl
        model_path = os.path.join(os.path.dirname(__file__), 'modelo_valoracion.pkl')

        if not os.path.exists(model_path):
            resultado = {
                "valor": float(input_data.get('area', 0)) * 1100,
                "recomendacion": "Archivo modelo_valoracion.pkl no encontrado. Usando valor simulado.",
                "status": "warning"
            }
        else:
            model = joblib.load(model_path)

            # 3. Preparar los datos de entrada en el formato EXACTO del entrenamiento
            # Nombres que llegan desde Node: area, suelo, riego, vias
            prepared_data = {
                'area_hectareas': float(input_data.get('area', 0)),
                'acceso_riego': int(input_data.get('riego', 0)),
                'proximidad_vias_km': float(input_data.get('vias', 0)),
                # One-hot para tipo_suelo (igual que en entrenamiento)
                'tipo_suelo_fertil': 1 if input_data.get('suelo', '').lower() == 'fertil' else 0,
                'tipo_suelo_medio': 1 if input_data.get('suelo', '').lower() == 'medio' else 0,
                'tipo_suelo_pobre': 1 if input_data.get('suelo', '').lower() == 'pobre' else 0
            }

            # Crear DataFrame con las columnas correctas (en el orden del entrenamiento)
            df = pd.DataFrame([prepared_data])

            # 4. Realizar la predicción
            prediccion = model.predict(df)[0]  # [0] porque predict devuelve array

            resultado = {
                "valor": round(float(prediccion), 2),
                "recomendacion": "Cultivo optimizado según modelo IA",
                "status": "success"
            }

        # 5. Devolver resultado a Node.js vía STDOUT (JSON)
        print(json.dumps(resultado))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()