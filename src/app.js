const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.get('/healthcheck', (req, res) => res.send('OK'));

try {
    console.log("🛠️ Intentando cargar rutas de Auth...");
    require('./routes/auth.routes')(app);
    console.log("Rutas de Auth cargadas en el código.");
} catch (error) {
    console.error("ERROR AL CARGAR RUTAS DE AUTH:", error.message);
}
// Middlewares Globales
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta base
app.get('/', (req, res) => {
  res.status(200).json({ status: "online", project: "TerrePlus API" });
});

// Carga de Rutas (Aquí es donde ocurre la magia)
require('./routes/auth.routes')(app);
require('./routes/terrain.routes')(app);
require('./routes/ml.routes')(app);
require('./routes/user.routes')(app);
require('./routes/factor.routes')(app);

// --- LOG DE DEPURACIÓN (Ponlo justo aquí) ---
setTimeout(() => {
    if (app._router && app._router.stack) {
        console.log("🚀 RUTAS REGISTRADAS EN EL SISTEMA:");
        app._router.stack.forEach(r => {
            if (r.route) {
                console.log(`- [${Object.keys(r.route.methods).join(',').toUpperCase()}] ${r.route.path}`);
            }
        });
    } else {
        console.log("⚠️ El router de Express no se cargó correctamente.");
    }
}, 1000); 

// Middleware para manejo de 404 (SIEMPRE AL FINAL)
app.use((req, res) => {
  res.status(404).json({ message: "La ruta solicitada no existe." });
});

module.exports = app;