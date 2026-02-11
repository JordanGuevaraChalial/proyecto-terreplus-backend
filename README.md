# TerrePlus - Backend

Descripción
-
Aplicación backend para TerrePlus: API REST en Node.js con integración de modelos de ML en Python. Gestión de usuarios, terrenos, factores, historial y dashboard. Contiene migraciones, servicios para invocar scripts Python y un pipeline básico de ML en `ml/`.

Requisitos
-
- Node.js 20+
- Python 3.11+
- npm
- (Opcional) `sequelize-cli` para ejecutar migraciones si se usa Sequelize

Instalación (Windows)
-
1. Clona el repositorio:

```bash
git clone <repo-url>
cd proyecto-terreplus-backend
```

2. Instala dependencias Node y Python:

```powershell
npm install
python -m venv venv
venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

3. Variables de entorno (ejemplos)
-
Crea un archivo `.env` o configura tu entorno con las variables necesarias. Variables típicas usadas por el proyecto:

- `PORT` — puerto donde corre la API (ej. 3000)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` — datos de la base de datos
- `JWT_SECRET` — secreto para JWT
- `NODE_ENV` — `development` o `production`
- `MODEL_PATH` — (opcional) ruta al modelo ML generado

Ajusta según tu configuración en `src/config/`.

Migraciones
-
Las migraciones están en el directorio `migrations/`. Si usas Sequelize, ejecuta las migraciones con `sequelize-cli`:

```bash
npx sequelize-cli db:migrate
```

Si el proyecto tiene scripts personalizados para migraciones, revisa `package.json` o la configuración de `src/models`.

Ejecutar la aplicación
-
Arrancar en modo producción:

```bash
npm start
```

Arrancar directamente (desarrollo):

```bash
node src/index.js
# o
node src/app.js
```

Estructura principal del proyecto
-
- `src/` — código fuente Node.js
  - `config/` — configuración y conexión a BD (`db.js`, `auth.config.js`)
  - `controllers/` — lógica de controladores (auth, terrain, ml, user, etc.)
  - `routes/` — rutas Express por módulo (`auth.routes.js`, `ml.routes.js`, `terrain.routes.js`, ...)
  - `models/` — modelos (probablemente Sequelize): `User.js`, `Terrain.js`, `ModeloML.js`, etc.
  - `services/` — servicios reutilizables: `python.service.js`, `estimacion.service.js`, `report.service.js`
  - `middleware/` — autenticación y validación
- `migrations/` — scripts de migración de la BD
- `ml/` — scripts y dataset para entrenamiento (`train_model.py`, `predict_bridge.py`, `dataset_terrenos.csv`)
- `models/` — carpeta con artefactos JS/Node (revisar `models/index.js`)

Rutas y endpoints (resumen)
-
Archivos de rutas en `src/routes/`:
- `auth.routes.js` — registro, login, refresh token
- `user.routes.js` — operaciones de usuario
- `terrain.routes.js` — CRUD de terrenos
- `factor.routes.js` — factores de estimación
- `ml.routes.js` — endpoints para predicción/estimación (usa `services/python.service.js` para invocar Python)
- `dashboard.routes.js` — datos agregados para tablero

Ejemplo de petición (login):

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"tu_usuario","password":"tu_password"}'
```

Integración ML
-
La carpeta `ml/` contiene el pipeline de entrenamiento y un puente de predicción:
- `train_model.py` — script de entrenamiento que usa `dataset_terrenos.csv`.
- `predict_bridge.py` — script para realizar predicciones desde CLI o invocado por `python.service.js`.

Para entrenar el modelo:

```bash
venv\Scripts\activate
python ml/train_model.py
```

Para probar la predicción desde Python:

```bash
python ml/predict_bridge.py --input "{...}"
```

`src/services/python.service.js` gestiona la ejecución de los scripts Python desde Node (IPC o invocación de procesos). Asegúrate de tener Python y dependencias instaladas en el entorno de despliegue.

Despliegue
-
- Asegura que Node y Python estén instalados en el servidor.
- Define las variables de entorno (BD, JWT, puerto, etc.).
- Ejecuta migraciones antes de iniciar la app.
- Inicia la app con `npm start` o usa un proceso gestor como PM2.

Consideraciones de producción
-
- Usa HTTPS y un proxy inverso (nginx) si corresponde.
- Mantén secretos en un gestor de secretos (no en el repo).
- Si ejecutas ML en producción, pruebas de rendimiento y aislamiento (contenedor, servicio separado) son recomendables.

Contribuir
-
- Abrir issues o pull requests.
- Seguir convenciones de código y pruebas (si existen).

Contacto y licencia
-
- Contacto: (agrega información de contacto del equipo)
- Licencia: (agrega la licencia deseada, p.ej. MIT)

---

Este README es una guía inicial. Revisa `src/config/`, `package.json` y `requirements.txt` para comandos y variables exactas del proyecto y actualiza las secciones según convenga.
