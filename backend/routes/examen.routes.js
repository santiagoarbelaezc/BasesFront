const express = require('express');
const router = express.Router();
const examenController = require('../controllers/examen.controller');

router.post('/', examenController.insertarExamen);
router.put('/:id', examenController.actualizarExamen);
router.delete('/:id', examenController.eliminarExamen);
router.get('/', examenController.obtenerExamenes);


module.exports = router;
