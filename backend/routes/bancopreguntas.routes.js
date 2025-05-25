const express = require('express');
const router = express.Router();
const bancoController = require('../controllers/bancoPreguntas.controller');

// Rutas existentes
router.post('/', bancoController.insertarPregunta);
router.put('/:id', bancoController.actualizarPregunta);
router.delete('/:id', bancoController.eliminarPregunta);

// Nuevas rutas añadidas
router.get('/', bancoController.obtenerBancoPreguntas);          // Obtener todas las preguntas
router.get('/:id', bancoController.obtenerPreguntaPorId);       // Obtener pregunta por ID
router.get('/usuario/:usuario_id', bancoController.obtenerPreguntasPorUsuarioId); // Obtener por usuario ID

module.exports = router;