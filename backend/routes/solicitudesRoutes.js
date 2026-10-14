const express = require('express');
const {
  crearSolicitud,
  listarSolicitudes,
  obtenerSolicitud,
  actualizarSolicitud,
  eliminarSolicitud
} = require('../controllers/solicitudesController');
const router = express.Router();

router.post('/', crearSolicitud);
router.get('/', listarSolicitudes);
router.get('/:id', obtenerSolicitud);
router.put('/:id', actualizarSolicitud);
router.delete('/:id', eliminarSolicitud);

module.exports = router;
