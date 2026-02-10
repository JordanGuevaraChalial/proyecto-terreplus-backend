# train_model.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib

print("=== Entrenamiento del modelo para TerrePlus ===")

# 1. Cargar el dataset
print("Cargando dataset...")
df = pd.read_csv('dataset_terrenos.csv')

# 2. Preprocesar: convertir tipo_suelo a dummies (one-hot encoding)
print("Preprocesando datos...")
df = pd.get_dummies(df, columns=['tipo_suelo'])

# 3. Separar features (X) y target (y)
X = df.drop('valor_por_hectarea', axis=1)
y = df['valor_por_hectarea']

# 4. Dividir en entrenamiento y prueba (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5. Crear y entrenar el modelo
print("Entrenando RandomForest...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 6. Evaluar precisión
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Resultados de evaluación:")
print(f"  - Error cuadrático medio (MSE): {mse:.2f}")
print(f"  - Coeficiente de determinación (R²): {r2:.4f}  (cuanto más cerca de 1.0, mejor)")

if r2 >= 0.80:
    print("¡Éxito! Precisión alcanzada o superada el objetivo del 80%.")
else:
    print("Precisión por debajo del 80%. Puedes mejorar con más datos o XGBoost.")

# 7. Guardar el modelo
joblib.dump(model, 'modelo_valoracion.pkl')
print("Modelo guardado exitosamente en: modelo_valoracion.pkl")
print("¡Listo! Copia este archivo a tu carpeta ml/ del proyecto backend.")