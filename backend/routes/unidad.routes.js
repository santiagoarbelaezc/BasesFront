const express = require('express');
const router = express.Router();
const unidadController = require('../controllers/unidad.controller');

router.post('/', unidadController.insertarUnidad);
router.put('/:id', unidadController.actualizarUnidad);
router.delete('/:id', unidadController.eliminarUnidad);
router.get('/completo', unidadController.obtenerUnidadesConContenidosYTemas);


module.exports = router;
