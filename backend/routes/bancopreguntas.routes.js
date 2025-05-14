const express = require('express');
const router = express.Router();
const bancoController = require('../controllers/bancoPreguntas.controller');

router.post('/', bancoController.insertarPregunta);
router.put('/:id', bancoController.actualizarPregunta);
router.delete('/:id', bancoController.eliminarPregunta);

module.exports = router;
