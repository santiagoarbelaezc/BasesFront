const express = require('express');
const router = express.Router();
const asignacionController = require('../controllers/asignacion.controller');

router.post('/examenes/:id/asignar', asignacionController.asignarPreguntas);

module.exports = router;