const express = require('express');
const router = express.Router();
const examenPresentadoController = require('../controllers/examenPresentado.controller');

router.post('/', examenPresentadoController.insertarExamenPresentado);
router.put('/:id', examenPresentadoController.actualizarExamenPresentado);
router.delete('/:id', examenPresentadoController.eliminarExamenPresentado);
router.get('/', examenPresentadoController.obtenerExamenesPresentados);
router.get('/:id', examenPresentadoController.obtenerExamenPresentadoPorId);

module.exports = router;
