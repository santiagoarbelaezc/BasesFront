const express = require('express');
const router = express.Router();
const controller = require('../controllers/subpregunta.controller');

router.post('/', controller.insertarSubpregunta);
router.put('/:id', controller.actualizarSubpregunta);
router.delete('/:id', controller.eliminarSubpregunta);
router.get('/pregunta/:pregunta_id', controller.obtenerSubpreguntasPorPregunta);

module.exports = router;
