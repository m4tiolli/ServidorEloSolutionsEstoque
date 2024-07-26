const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Multer para armazenamento em memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/seu-banco-de-dados', { useNewUrlParser: true, useUnifiedTopology: true });

const produtoSchema = new Schema({
  nome: String,
  descricao: String,
  patrimonio: String,
  numSerie: String,
  notafiscal: String,
  localizacao: String,
  image: Buffer, // Armazena a imagem como um buffer binário
});

const Produto = mongoose.model('Produto', produtoSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/produtos', upload.single('image'), async (req, res) => {
  try {
    const { nome, descricao, patrimonio, numSerie, notafiscal, localizacao } = req.body;
    const file = req.file;

    const produto = new Produto({
      nome,
      descricao,
      patrimonio,
      numSerie,
      notafiscal,
      localizacao,
      image: file ? file.buffer : null, // Armazena o buffer da imagem
    });

    await produto.save();
    res.status(201).json({ message: 'Item cadastrado com sucesso!', produto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar o item' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
