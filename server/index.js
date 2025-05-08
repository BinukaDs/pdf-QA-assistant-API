import express from "express";
import cors from "cors";
import {
  createJsonEmbeddings,
  createSearchEmbeddings,
} from "./src/services/embeddingService.js";
import { parsePDF } from "./src/services/pdfService.js";
import { searchEmbeddings } from "./src/services/searchService.js";
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true     
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/pdf/parse", parsePDF);
app.get("/embeddings/create", createJsonEmbeddings);
app.post("/embeddings/search", searchEmbeddings);

app.listen(3000);

 