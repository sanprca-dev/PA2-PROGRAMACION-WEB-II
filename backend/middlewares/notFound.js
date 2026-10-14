// Responde 404 cuando la ruta pedida no existe
function notFound(req, res) {
  return res.status(404).json({ mensaje: 'Ruta no encontrada' });
}

module.exports = notFound;
