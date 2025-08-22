require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 3001; 

app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('API do Marketplace está no ar!');
});

// Rotas de produtos

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});