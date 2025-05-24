const express = require('express');
const router = express.Router();
const preguntaController = require('../controllers/pregunta.controller');

router.post('/', preguntaController.insertarPregunta);
router.put('/:id', preguntaController.actualizarPregunta);
router.delete('/:id', preguntaController.eliminarPregunta);
router.get('/', preguntaController.obtenerPreguntas);
router.get('/examen/:examenId', preguntaController.obtenerPreguntasPorExamenId);

// Nuevo endpoint para obtener pregunta por id
router.get('/:id', preguntaController.obtenerPreguntaPorId);

module.exports = router;