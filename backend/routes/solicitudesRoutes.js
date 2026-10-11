const express = require('express');
const { crearSolicitud, listarSolicitudes } = require('../controllers/solicitudesController');
const router = express.Router();

router.post('/', crearSolicitud);
router.get('/', listarSolicitudes);

module.exports = router;