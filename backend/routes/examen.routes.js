const express = require('express');
const router = express.Router();
const examenController = require('../controllers/examen.controller');

router.post('/', examenController.insertarExamen);
router.put('/:id', examenController.actualizarExamen);
router.delete('/:id', examenController.eliminarExamen);
router.get('/', examenController.obtenerExamenes);

// Nuevo endpoint para obtener examen por id
router.get('/:id', examenController.obtenerExamenPorId);

module.exports = router;
