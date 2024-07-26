const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '5mb' }));

const client = new MongoClient("mongodb+srv://admin:EloSolutions@elosolutionsestoque.irpnis2.mongodb.net/?retryWrites=true&w=majority&appName=EloSolutionsEstoque")
const database = client.db('estoque');
const produtos = database.collection('produtos');

app.post('/produtos', async (req, res) => {
  try {
    const { nome, descricao, patrimonio, numSerie, notafiscal, localizacao, imagem } = req.body;

    const dados = {
      nome, descricao, patrimonio, numSerie, notafiscal, localizacao, imagem
    }

    const result = await produtos.insertOne(dados);
    res.status(201).json({ message: 'Item cadastrado com sucesso!' + dados + result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar o item' });
  }
});

app.get("/produtos", async (req, res) => {
  try {
    const resultado = await produtos.find().toArray()
    res.status(200).json(resultado)
  } catch (erro) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar o item' });
  }
})

app.get("/produtos/:query", async (req, res) => {
  try {
    const { query } = req.params
    const parametros = { "nome": { "$regex": query } }
    const resultado = await produtos.find(parametros).toArray()
    res.status(200).json(resultado)
  } catch (erro) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar o item' });
  }
})

app.put("/produtos/:id", async (req, res) => {
  try {
    const { nome, descricao, patrimonio, numSerie, notafiscal, localizacao, imagem } = req.body;
    const { id } = req.params

    const dados = {
      nome, descricao, patrimonio, numSerie, notafiscal, localizacao, imagem
    }

    const result = await produtos.updateOne({ _id: new ObjectId(id) }, { $set: dados });
    res.status(201).json({ message: 'Item atualizado com sucesso!' + dados + result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar o item' });
  }
});

app.delete("/produtos/:id", async (req, res) => {
  try {
    const { id } = req.params

    const result = await produtos.deleteOne({ _id: new ObjectId(id) });
    res.status(201).json({ message: 'Item deletado com sucesso!' + result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar o item' });
  }
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
