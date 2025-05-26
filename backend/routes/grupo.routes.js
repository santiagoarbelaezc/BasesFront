const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/grupo.controller');

// Extras - deben ir antes de las rutas con ':id' para evitar conflictos
router.get('/:grupoId/estudiantes', grupoController.obtenerUsuariosPorGrupo); // ✅ corregido
router.delete('/:grupoId/estudiantes/:usuarioId', grupoController.quitarUsuarioDeGrupo);
router.post('/asignar-usuario', grupoController.asignarUsuarioAGrupo);

// CRUD grupo
router.post('/', grupoController.insertarGrupo);
router.get('/', grupoController.obtenerGrupos);
router.get('/:id', grupoController.obtenerGrupoPorId);
router.put('/:id', grupoController.actualizarGrupo);
router.delete('/:id', grupoController.eliminarGrupo);

module.exports = router;
