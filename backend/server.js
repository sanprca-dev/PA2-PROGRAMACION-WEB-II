const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/salud', (req, res) => {
  res.json({ mensaje: 'API PA2 funcionando' });
});

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});