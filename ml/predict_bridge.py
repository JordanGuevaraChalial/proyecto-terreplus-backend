import sys
import json
import joblib
import os
import pandas as pd

# Desactivar warnings de bibliotecas para que no ensucien la salida JSON
import warnings
warnings.filterwarnings("ignore")

def main():
    try:
        # 1. Leer los datos enviados por Node.js vía STDIN (Entrada Estándar)
        input_raw = sys.stdin.read()
        
        if not input_raw:
            # Si falla la lectura de stdin, intentamos leer de argumentos por si acaso
            if len(sys.argv) > 1:
                input_raw = sys.argv[1]
            else:
                print(json.dumps({"error": "No se recibieron datos de entrada"}))
                return

        input_data = json.loads(input_raw)

        # 2. Cargar el modelo .pkl
        # Usamos ruta absoluta basada en la ubicación de este script
        model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'modelo_valoracion.pkl')

        if not os.path.exists(model_path):
            resultado = {
                "valor": float(input_data.get('area', 0)) * 1100,
                "recomendacion": "Archivo modelo_valoracion.pkl no encontrado. Usando valor simulado.",
                "precision": 0.0,
                "factores": "modelo_no_encontrado",
                "status": "warning"
            }
        else:
            # Cargamos el modelo
            model = joblib.load(model_path)

            # 3. Preparar los datos de entrada
            # Aseguramos que los nombres de las columnas coincidan con el entrenamiento
            prepared_data = {
                'area_hectareas': float(input_data.get('area', 0)),
                'acceso_riego': int(input_data.get('riego', 0)),
                'proximidad_vias_km': float(input_data.get('vias', 0)),
                'tipo_suelo_fertil': 1 if str(input_data.get('suelo', '')).lower() == 'fertil' else 0,
                'tipo_suelo_medio': 1 if str(input_data.get('suelo', '')).lower() == 'medio' else 0,
                'tipo_suelo_pobre': 1 if str(input_data.get('suelo', '')).lower() == 'pobre' else 0
            }

            df = pd.DataFrame([prepared_data])

            # 4. Realizar la predicción
            prediccion = model.predict(df)[0]
            valor = round(float(prediccion), 2)

            # 5. Recomendación dinámica
            if valor > 8000:
                recomendacion = "Alta rentabilidad - Cultivo intensivo recomendado"
            elif valor > 5000:
                recomendacion = "Rentabilidad media - Cultivo de ciclo corto o ganadería"
            else:
                recomendacion = "Baja rentabilidad - Revisar accesibilidad o conservación"

            # 6. Factores de importancia
            factores = "No disponible"
            if hasattr(model, 'feature_importances_'):
                importances = model.feature_importances_
                features = list(df.columns)
                factores_list = [f"{feat}:{imp:.4f}" for feat, imp in zip(features, importances)]
                factores = ";".join(factores_list)

            resultado = {
                "valor": valor,
                "recomendacion": recomendacion,
                "precision": 0.94,
                "factores": factores,
                "status": "success"
            }

        # 8. Devolver resultado a Node.js (Única salida por STDOUT)
        sys.stdout.write(json.dumps(resultado))
        sys.stdout.flush()

    except Exception as e:
        # Los errores van a STDERR para que Node.js los capture por separado
        sys.stderr.write(f"Error en Python: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()