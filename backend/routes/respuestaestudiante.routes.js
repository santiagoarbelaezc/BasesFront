const express = require('express');
const router = express.Router();
const respuestaEstudianteController = require('../controllers/respuestaestudiante.controller');

router.post('/', respuestaEstudianteController.insertarRespuestaEstudiante);
router.put('/:id', respuestaEstudianteController.actualizarRespuestaEstudiante);
router.delete('/:id', respuestaEstudianteController.eliminarRespuestaEstudiante);
router.get('/', respuestaEstudianteController.obtenerRespuestasEstudiante);


router.get('/:id', respuestaEstudianteController.obtenerRespuestaEstudiantePorId);

module.exports = router;
