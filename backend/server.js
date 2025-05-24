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
const examenRoutes = require('./routes/examen.routes');
const examenPresentadoRoutes = require('./routes/examenPresentado.routes'); // <--- Aquí importas las rutas de examenPresentado
const preguntaRoutes = require('./routes/pregunta.routes');
const respuestaRoutes = require('./routes/respuesta.routes');
const respuestaEstudianteRoutes = require('./routes/respuestaestudiante.routes');
const bancoPreguntasRoutes = require('./routes/bancoPreguntas.routes');
// Modulos que no tienen CRUD, solo logica del negocio 
const asignacionRoutes = require('./routes/asignacion.routes');

// Usar rutas
app.use('/api/roles', rolRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/unidades', unidadRoutes);
app.use('/api/contenidos', contenidoRoutes);
app.use('/api/temas', temaRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/dificultades', dificultadRoutes);
app.use('/api/examenes', examenRoutes);
app.use('/api/examenesPresentados', examenPresentadoRoutes);  // <--- Aquí usas las rutas de examenPresentado
app.use('/api/preguntas', preguntaRoutes);
app.use('/api/respuestas', respuestaRoutes);
app.use('/api/respuestasEstudiante', respuestaEstudianteRoutes);
app.use('/api/bancoPreguntas', bancoPreguntasRoutes);
// Modulos que no tienen CRUD, solo logica del negocio 
app.use('/api', asignacionRoutes);

// Puerto de escucha
app.listen(3000, () => console.log('✅ Backend corriendo en http://localhost:3000'));
