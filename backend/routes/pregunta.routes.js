const express = require('express');
const router = express.Router();
const controller = require('../controllers/pregunta.controller');

router.get('/', controller.obtenerPreguntas );
router.post('/', controller.insertarPregunta);
router.put('/:id', controller.actualizarPregunta);
router.delete('/:id', controller.eliminarPregunta);

module.exports = router;
