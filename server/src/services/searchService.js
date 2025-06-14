import { createSearchEmbeddings } from "./embeddingService.js";
import { generateAnswer } from "./chatService.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFilePath = path.join(__dirname, "../../data/embeddings.json");
const jsonData = fs.readFileSync(jsonFilePath, "utf8");
const parsedData = JSON.parse(jsonData);

export const searchEmbeddings = async (req, res) => {
  const { userQuestion } = req.body;

  if (!userQuestion) {
    return res.status(400).json({ message: "No text provided" });
  } else {
    const embedding = await createSearchEmbeddings(userQuestion);
    // console.log("Embedding created successfully: ", embedding);
    if (embedding.status === 200) {
      const searchEmbedding = embedding.data;

      const scores = parsedData.map((page) => {
        const score = cosineSimilarity(searchEmbedding, page.embedding);
        return {
          ...page.page,
          score: score,
          page: page.page,
        };
      });

      scores.sort((a, b) => b.score - a.score);

      const topScores = scores.slice(0, 5);

      const topPages = topScores.map((score) => {
        return parsedData.find((p) => p.page === score.page);
      });
      console.log("page: ", topPages);

      const answer = await generateAnswer(userQuestion, topPages);
      if (answer) {
        // console.log("Answer: ", answer);
        res.status(200).json({
          message: "Answer generated successfully",
          answer: answer,
        });
      } else {
        console.log("No answer found");
        res.status(404).json({
          message: "No answer found",
        });
      }
    } else {
      res.status(embedding.status).json({
        message: "Error creating embeddings",
        error: embedding.error,
      });
    }
  }
};

const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};
