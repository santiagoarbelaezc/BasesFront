const express = require('express');
const router = express.Router();
const respuestaController = require('../controllers/respuesta.controller');

router.post('/', respuestaController.insertarRespuesta);
router.put('/:id', respuestaController.actualizarRespuesta);
router.delete('/:id', respuestaController.eliminarRespuesta);
router.get('/', respuestaController.obtenerRespuestas);
router.get('/:id', respuestaController.obtenerRespuestaPorId);

// Esta ruta debe ir antes de la ruta /:id para que no haya conflicto
router.get('/pregunta/:preguntaId', respuestaController.obtenerRespuestasPorPreguntaId);

module.exports = router;
