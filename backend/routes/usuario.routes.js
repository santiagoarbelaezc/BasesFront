const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

router.post('/register', usuarioController.registrarUsuario);
router.post('/login', usuarioController.loginUsuario);
router.get('/', usuarioController.obtenerUsuarios);
router.put('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;
