const express = require('express');
const router = express.Router();
const temaController = require('../controllers/tema.controller');

router.post('/', temaController.insertarTema);
router.put('/:id', temaController.actualizarTema);
router.delete('/:id', temaController.eliminarTema);

module.exports = router;
