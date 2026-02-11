const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// 1. CONFIGURACIÓN DE CORS
// Esto permite que tu frontend en Railway se comunique con este backend
const whiteList = [
  'https://proyecto-terreplus-frontend-production.up.railway.app',
  'http://localhost:3000'  
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman o Server-to-Server)
    if (!origin || whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Bloqueado por CORS origen:", origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. MIDDLEWARES (Traductores)
app.use(morgan('dev'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 3. RUTAS DE DIAGNÓSTICO
app.get('/healthcheck', (req, res) => res.send('OK'));
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: "online", 
    project: "TerrePlus API",
    message: "Bienvenido a la API de TerrePlus" 
  });
});

// 4. CARGA DE RUTAS
// Asegúrate de que estos archivos existan en tu carpeta /routes
require('./routes/auth.routes')(app);
require('./routes/terrain.routes')(app);
require('./routes/ml.routes')(app);
require('./routes/user.routes')(app);
require('./routes/factor.routes')(app);
require('./routes/dashboard.routes')(app);

// --- LOG DE DEPURACIÓN DE RUTAS ---
// Esto ayuda a ver en la consola de Railway si las rutas cargaron bien
setTimeout(() => {
    if (app._router && app._router.stack) {
        console.log("RUTAS REGISTRADAS EN EL SISTEMA:");
        app._router.stack.forEach(r => {
            if (r.route) {
                console.log(`- [${Object.keys(r.route.methods).join(',').toUpperCase()}] ${r.route.path}`);
            }
        });
    }
}, 1000);

// 5. MANEJO DE 404 (Siempre al final de todas las rutas)
app.use((req, res) => {
  res.status(404).json({ 
    message: `La ruta ${req.originalUrl} no existe en este servidor.` 
  });
});

module.exports = app;