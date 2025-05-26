const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');

// 1. Exámenes presentados
// GET /api/examenes
router.get('/examenes', reportesController.getExamenesPresentados);

// 2. Estadísticas por pregunta en un examen
// GET /api/preguntas/:examenId/estadisticas
router.get('/preguntas/:examenId/estadisticas', reportesController.getEstadisticasPorPregunta);

// 3. Resumen general de un curso
// GET /api/resumen/curso/:cursoId
router.get('/resumen/curso/:cursoId', reportesController.getResumenCurso);

// 4. Notas de estudiantes en un curso
// GET /api/notas/:cursoId
router.get('/notas/:cursoId', reportesController.getNotasPorCurso);

module.exports = router;
