const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// 1. PRIMERO LOS MIDDLEWARES (Los traductores)
app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); // <--- ¡Este es el más importante que debe ir arriba!
app.use(express.urlencoded({ extended: true }));

// 2. SEGUNDO: RUTAS DE DIAGNÓSTICO
app.get('/healthcheck', (req, res) => res.send('OK'));
app.get('/', (req, res) => {
  res.status(200).json({ status: "online", project: "TerrePlus API" });
});

// 3. TERCERO: CARGA DE RUTAS (Ahora sí, ya pueden leer JSON)
require('./routes/auth.routes')(app);
require('./routes/terrain.routes')(app);
require('./routes/ml.routes')(app);
require('./routes/user.routes')(app);
require('./routes/factor.routes')(app);
require('./routes/dashboard.routes')(app);

// --- LOG DE DEPURACIÓN ---
setTimeout(() => {
    if (app._router && app._router.stack) {
        console.log("🚀 RUTAS REGISTRADAS EN EL SISTEMA:");
        app._router.stack.forEach(r => {
            if (r.route) {
                console.log(`- [${Object.keys(r.route.methods).join(',').toUpperCase()}] ${r.route.path}`);
            }
        });
    }
}, 1000);

// 4. CUARTO: MANEJO DE 404 (Siempre al final)
app.use((req, res) => {
  res.status(404).json({ message: "La ruta solicitada no existe." });
});

module.exports = app;