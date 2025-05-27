const express = require('express');
const router = express.Router();
const calificacionController = require('../controllers/calificacion.controller');

// Ruta para obtener la nota final ponderada de un estudiante
router.get('/nota-final/:usuarioId', calificacionController.obtenerNotaFinalPorUsuario);

module.exports = router;
