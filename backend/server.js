const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Importar rutas
const rolRoutes = require('./routes/rol.routes');
const usuarioRoutes = require('./routes/usuario.routes');

// Usar rutas
app.use('/api/roles', rolRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.listen(3000, () => console.log('✅ Backend corriendo en http://localhost:3000'));
