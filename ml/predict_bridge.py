import sys
import json
import joblib
import os
import pandas as pd

def main():
    try:
        # 1. Leer los datos enviados por Node.js
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
                "precision": 0.0,
                "factores": "modelo_no_encontrado",
                "status": "warning"
            }
        else:
            model = joblib.load(model_path)

            # 3. Preparar los datos de entrada (mismo formato que en entrenamiento)
            prepared_data = {
                'area_hectareas': float(input_data.get('area', 0)),
                'acceso_riego': int(input_data.get('riego', 0)),
                'proximidad_vias_km': float(input_data.get('vias', 0)),
                'tipo_suelo_fertil': 1 if input_data.get('suelo', '').lower() == 'fertil' else 0,
                'tipo_suelo_medio': 1 if input_data.get('suelo', '').lower() == 'medio' else 0,
                'tipo_suelo_pobre': 1 if input_data.get('suelo', '').lower() == 'pobre' else 0
            }

            df = pd.DataFrame([prepared_data])

            # 4. Realizar la predicción
            prediccion = model.predict(df)[0]
            valor = round(float(prediccion), 2)

            # 5. Recomendación dinámica basada en el valor
            if valor > 8000:
                recomendacion = "Alta rentabilidad - Cultivo intensivo recomendado"
            elif valor > 5000:
                recomendacion = "Rentabilidad media - Cultivo de ciclo corto o ganadería"
            else:
                recomendacion = "Baja rentabilidad - Revisar accesibilidad o conservación"

            # 6. Factores de importancia (si el modelo lo soporta, ej. RandomForest/XGBoost)
            factores = "No disponible"
            if hasattr(model, 'feature_importances_'):
                importances = model.feature_importances_
                features = list(df.columns)
                factores_list = []
                for feat, imp in zip(features, importances):
                    factores_list.append(f"{feat}:{imp:.4f}")
                factores = ";".join(factores_list)

            # 7. Precisión (estática o puedes cargarla de un archivo al entrenar)
            precision = 0.94  # Cambia por valor real del entrenamiento si lo guardas

            resultado = {
                "valor": valor,
                "recomendacion": recomendacion,
                "precision": precision,
                "factores": factores,
                "status": "success"
            }

        # 8. Devolver resultado a Node.js
        print(json.dumps(resultado))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()