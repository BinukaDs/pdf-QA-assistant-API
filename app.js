import express from "express";
import { createJsonEmbeddings } from "./src/services/embeddingService.js";
import { parsePDF } from "./src/services/pdfService.js";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/pdf/parse", parsePDF);
app.get("/embeddings/create", createJsonEmbeddings);

app.listen(3000);
