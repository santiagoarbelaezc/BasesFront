const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Importar rutas
const rolRoutes = require('./routes/rol.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const grupoRoutes = require('./routes/grupo.routes');
const unidadRoutes = require('./routes/unidad.routes');
const contenidoRoutes = require('./routes/contenido.routes');
const temaRoutes = require('./routes/tema.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const dificultadRoutes = require('./routes/dificultad.routes');

// Usar rutas
app.use('/api/roles', rolRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/unidades', unidadRoutes);
app.use('/api/contenidos', contenidoRoutes);
app.use('/api/temas', temaRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/dificultades', dificultadRoutes);

// Puerto de escucha
app.listen(3000, () => console.log('✅ Backend corriendo en http://localhost:3000'));