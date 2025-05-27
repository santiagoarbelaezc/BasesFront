const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

router.post('/register', usuarioController.registrarUsuario);
router.post('/login', usuarioController.loginUsuario);
router.get('/', usuarioController.obtenerUsuarios);
router.get('/correo/:correo', usuarioController.obtenerUsuarioPorCorreo); // Buscar por correo
router.get('/rol/:rol_id', usuarioController.obtenerUsuariosPorRol);      // ✅ Buscar por rol
router.put('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);
router.get('/:id/info-academica', usuarioController.obtenerInfoAcademica); // 🔍 Info académica de un usuario

module.exports = router;
