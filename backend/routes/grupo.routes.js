const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/grupo.controller');

router.post('/', grupoController.insertarGrupo);
router.put('/:id', grupoController.actualizarGrupo);
router.delete('/:id', grupoController.eliminarGrupo);

module.exports = router;
