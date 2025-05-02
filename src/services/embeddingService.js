import OpenAI from "openai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const jsonFilePath = path.join(process.cwd(), "uploads", "page-data.json");
const jsonData = fs.readFileSync(jsonFilePath, "utf8");
const parsedData = JSON.parse(jsonData);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  apiBaseUrl: "https://api.openai.com/v1/embeddings",
});

const createEmbedding = async (text) => {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
    encoding_format: "float",
  });

  return embedding.data[0].embedding;
};

export const createJsonEmbeddings = async (req, res) => {
  try {
    const embeddings = await Promise.all(
      parsedData.map(async (page) => {
          const embedding = await createEmbedding(page.text);
            return {
              page: page.page,
              text: page.text,
              embedding: embedding,
            };
      })
    );

    fs.writeFileSync(
      path.join(process.cwd(), "data", "embeddings.json"),
      JSON.stringify(embeddings, null, 2)
    );

    res
      .status(200)
      .json({ message: "Embeddings created successfully", data: embeddings });
  } catch (error) {
    console.error("Error creating embeddings:", error);
    res
      .status(500)
      .json({ message: "Error creating embeddings", error: error.message });
  }
};

export const createSearchEmbeddings = async (userText) => {
  if (!userText) {
    return {
      status: 400,
      message: "No text provided",
    };
  } else {
    try {
      const embedding = await createEmbedding(userText);

      return {
        status: 200,
        message: "Embeddings created successfully",
        data: embedding,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Error creating embeddings",
        error: error.message,
      };
    }
  }
};
