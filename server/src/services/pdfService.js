import PdfParse from "pdf-parse";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataBuffer = fs.readFileSync(
  path.join(__dirname, "../../uploads/sample.pdf")
);

export const parsePDF = async (req, res) => {
  try {
    const data = await PdfParse(dataBuffer);
    const text = data.text;
    const writeData = [];
    const pages = text.split(/\n\n/);
    pages.forEach((pageText, index) => {
      writeData.push({
        page: index + 1,
        text: pageText.trim(),
      });
    });

    fs.writeFileSync(
      path.join(__dirname, "../../uploads/page-data.json"),
      JSON.stringify(writeData, null, 2)
    );

    res.status(200).json({ message: "PDF parsed successfully", data: pages });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    res
      .status(500)
      .json({ message: "Error parsing PDF", error: error.message });
  }
};
