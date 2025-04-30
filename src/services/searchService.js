import { createSearchEmbeddings } from "./embeddingService.js";
import { generateAnswer } from "./chatService.js";
import fs from "fs";
import path, { parse } from "path";

const jsonFilePath = path.join(process.cwd(), "data", "embeddings.json");
const jsonData = fs.readFileSync(jsonFilePath, "utf8");
const parsedData = JSON.parse(jsonData);
export const searchEmbeddings = async (req, res) => {
  const { userText } = req.body;

  if (!userText) {
    return res.status(400).json({ message: "No text provided" });
  } else {
    const embedding = await createSearchEmbeddings(userText);
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
        // console.log("page: ", page.embedding);
      });

      scores.sort((a, b) => b.score - a.score);

      const topScores = scores.slice(0, 3);

      const topPages = topScores.map((score) => {
        return parsedData.find((p) => p.page === score.page);
      });

      const answer = await generateAnswer(userText, topPages);
      if (answer) {
        console.log("Answer: ", answer);
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
