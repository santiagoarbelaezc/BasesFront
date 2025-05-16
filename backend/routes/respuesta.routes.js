const express = require('express');
const router = express.Router();
const respuestaController = require('../controllers/respuesta.controller');

router.post('/', respuestaController.insertarRespuesta);
router.put('/:id', respuestaController.actualizarRespuesta);
router.delete('/:id', respuestaController.eliminarRespuesta);
router.get('/', respuestaController.obtenerRespuestas);
router.get('/:id', respuestaController.obtenerRespuestaPorId);

module.exports = router;
