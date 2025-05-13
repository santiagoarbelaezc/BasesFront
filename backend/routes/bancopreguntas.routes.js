const express = require('express');
const router = express.Router();
const bancoController = require('../controllers/banco.controller');

router.post('/', bancoController.insertarPregunta);
router.put('/:id', bancoController.actualizarPregunta);
router.delete
