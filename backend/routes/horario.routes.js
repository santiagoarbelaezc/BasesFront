const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horario.controller');

router.post('/', horarioController.crearHorario);
router.get('/:grupo_id', horarioController.obtenerHorariosPorGrupo);
router.put('/:id', horarioController.actualizarHorario);
router.delete('/:id', horarioController.eliminarHorario);

module.exports = router;
