const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');

// Crear una categoría
router.post('/', categoriaController.insertarCategoria);

// Actualizar una categoría
router.put('/:id', categoriaController.actualizarCategoria);

// Eliminar una categoría
router.delete('/:id', categoriaController.eliminarCategoria);

// Obtener todas las categorías
router.get('/', categoriaController.obtenerCategorias);

module.exports = router;
