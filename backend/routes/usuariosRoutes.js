const express = require('express');
const { crearUsuario, listarUsuarios } = require('../controllers/usuariosController');

// Creamos un "mini servidor" solo para las rutas de usuarios
const router = express.Router();

// POST /api/usuarios -> crear un usuario
router.post('/', crearUsuario);

// GET /api/usuarios -> listar usuarios
router.get('/', listarUsuarios);

module.exports = router;
