const express = require('express');
const router = express.Router();
const dificultadController = require('../controllers/dificultad.controller');

router.post('/', dificultadController.insertarDificultad);
router.put('/:id', dificultadController.actualizarDificultad);
router.delete('/:id', dificultadController.eliminarDificultad);

module.exports = router;
