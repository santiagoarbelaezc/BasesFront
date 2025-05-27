const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/curso.controller');

router.post('/', cursoController.crearCurso);
router.get('/', cursoController.obtenerCursos);
router.put('/:id', cursoController.actualizarCurso);
router.delete('/:id', cursoController.eliminarCurso);

// 🔧 NUEVO: obtener nombre del curso por tema_id
router.get('/por-tema/:temaId', cursoController.obtenerCursoPorTemaId);

module.exports = router;