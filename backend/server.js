const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const express = require('express');


// Importar rutas
const rolRoutes = require('./routes/rol.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const grupoRoutes = require('./routes/grupo.routes');
const cursoRoutes = require('./routes/curso.routes');
const unidadRoutes = require('./routes/unidad.routes');
const contenidoRoutes = require('./routes/contenido.routes');
const temaRoutes = require('./routes/tema.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const dificultadRoutes = require('./routes/dificultad.routes');
const examenRoutes = require('./routes/examen.routes');
const examenPresentadoRoutes = require('./routes/examenPresentado.routes');
const preguntaRoutes = require('./routes/pregunta.routes');
const subsubpreguntaRoutes = require('./routes/subpregunta.routes')
const respuestaRoutes = require('./routes/respuesta.routes');
const respuestaEstudianteRoutes = require('./routes/respuestaestudiante.routes');
const bancoPreguntasRoutes = require('./routes/bancoPreguntas.routes');
// Modulos que no tienen CRUD, solo logica del negocio 
const asignacionRoutes = require('./routes/asignacion.routes');
const reportesRoutes = require('./routes/reportes.routes');
const horarioRoutes = require('./routes/horario.routes'); // ✅ Aquí importas las rutas

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
app.use('/api/examenesPresentados', examenPresentadoRoutes);  
app.use('/api/preguntas', preguntaRoutes);
app.use('/api/subPregunta', subsubpreguntaRoutes)
app.use('/api/respuestas', respuestaRoutes);
app.use('/api/respuestasEstudiante', respuestaEstudianteRoutes);
app.use('/api/bancoPreguntas', bancoPreguntasRoutes);
app.use('/api/cursos', cursoRoutes);
// Modulos que no tienen CRUD, solo logica del negocio 
app.use('/api', asignacionRoutes);
app.use('/api/reportes', reportesRoutes); // → Esto hace que los endpoints queden disponibles en: /api/examenes, etc.
app.use('/api/horarios', horarioRoutes); // ✅ Aquí registras el endpoint


// Puerto de escucha
app.listen(3000, () => console.log('✅ Backend corriendo en http://localhost:3000'));