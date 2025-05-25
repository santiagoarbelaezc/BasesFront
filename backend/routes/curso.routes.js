const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/curso.controller');


router.post('/', cursoController.crearCurso);
router.get('/', cursoController.obtenerCursos);
router.put('/:id', cursoController.actualizarCurso);
router.delete('/:id', cursoController.eliminarCurso);

module.exports = router;
