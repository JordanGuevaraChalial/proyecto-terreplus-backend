const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middlewares Globales
app.use(cors()); // Permite peticiones desde React/Angular
app.use(morgan('dev')); // Logger para ver peticiones en la consola
app.use(express.json()); // Parseo de JSON en el cuerpo de las peticiones
app.use(express.urlencoded({ extended: true }));

// Ruta base de diagnóstico
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: "online",
    project: "TerrePlus API",
    version: "1.0.0",
    timestamp: new Date()
  });
});

// Carga de Rutas (Inyectamos la instancia de 'app')
require('./routes/auth.routes')(app);
require('./routes/terrain.routes')(app);
require('./routes/ml.routes')(app);
require('./routes/user.routes')(app);
require('./routes/factor.routes')(app);

// Middleware para manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ message: "La ruta solicitada no existe." });
});

module.exports = app;