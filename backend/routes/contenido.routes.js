const express = require('express');
const router = express.Router();
const contenidoController = require('../controllers/contenido.controller');

router.post('/', contenidoController.insertarContenido);
router.put('/:id', contenidoController.actualizarContenido);
router.delete('/:id', contenidoController.eliminarContenido);

module.exports = router;
