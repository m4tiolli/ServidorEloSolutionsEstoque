import express from "express";
import ProdutoController from '../controllers/produtoController.js'
import multer from 'multer'

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const routes = express.Router();

routes.get("/produtos", ProdutoController.listarProdutos);
routes.delete("/produtos/:id", ProdutoController.deletarProdutos)
routes.post("/produtos", upload.single('image'), ProdutoController.cadastrarProduto)

export default routes;