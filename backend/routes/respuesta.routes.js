const express = require('express');
const router = express.Router();
const controller = require('../controllers/respuesta.controller');

router.post('/', controller.insertarRespuesta);
router.put('/:id', controller.actualizarRespuesta);
router.delete('/:id', controller.eliminarRespuesta);
router.get('/pregunta/:pregunta_id', controller.obtenerRespuestasPorPregunta);

module.exports = router;
