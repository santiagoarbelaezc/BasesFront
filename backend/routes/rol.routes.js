const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rol.controller');

router.post('/', rolController.insertarRol);
router.get('/', rolController.listarRoles);
router.put('/:id', rolController.actualizarRol);
router.delete('/:id', rolController.eliminarRol);
router.get('/:id', rolController.obtenerRolPorId);  // <-- Nueva ruta añadida

module.exports = router;
