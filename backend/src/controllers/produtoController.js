import { MongoClient, ObjectId } from "mongodb";

class ProdutoController {
  static client = null;
  static database = null;
  static collection = null;

  static async connect() {
    if (!ProdutoController.client) {
      ProdutoController.client = new MongoClient(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
      await ProdutoController.client.connect();
      ProdutoController.database = ProdutoController.client.db("estoque");
      ProdutoController.collection = ProdutoController.database.collection("produtos");
    }
  }

  static async listarProdutos(req, res) {
    try {
      await ProdutoController.connect();
      const produtos = await ProdutoController.collection.find({}).toArray();
      res.status(200).json(produtos);
    } catch (erro) {
      res.status(500).json({ message: `${erro.message} - falha na requisição` });
    }
  }

  static async deletarProdutos(req, res) {
    try {
      await ProdutoController.connect();
      const { id } = req.params;
      const result = await ProdutoController.collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
        res.status(200).json({ message: "Produto deletado com sucesso" });
      } else {
        res.status(404).json({ message: "Produto não encontrado" });
      }
    } catch (erro) {
      res.status(500).json({ message: `${erro.message} - falha na requisição` });
    }
  }

  static async cadastrarProduto(req, res) {
    try {
      await ProdutoController.connect();
      const dados = {
        nome: req.body.nome,
        descricao: req.body.descricao,
        patrimonio: req.body.patrimonio,
        numSerie: req.body.numSerie,
        notafiscal: req.body.nf,
        localizacao: req.body.localizacao,
        imagem: req.file,
      };
      await ProdutoController.collection.insertOne(dados);
      res.status(200).json({ message: "Produto cadastrado com sucesso" });
    } catch (erro) {
      res.status(500).json({ message: `${erro.message} - falha na requisição` });
    }
  }

  static async atualizarProduto(req, res) {
    try {
      await ProdutoController.connect();
      const { id, descricao, patrimonio, numSerie, localizacao, notafiscal } = req.body;
      const result = await ProdutoController.collection.updateOne({ id }, { $set: { nome, descricao, patrimonio, numSerie, localizacao, notafiscal } });
      if (result.matchedCount === 1) {
        res.status(200).json({ message: "Produto atualizado com sucesso" });
      } else {
        res.status(404).json({ message: "Produto não encontrado" });
      }
    } catch (erro) {
      res.status(500).json({ message: `${erro.message} - falha na requisição` });
    }
  }
}

export default ProdutoController;
