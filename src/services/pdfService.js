import PdfParse from "pdf-parse";
import fs from "fs";

const dataBuffer = fs.readFileSync("./uploads/sample.pdf");

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
      `./uploads/page-data.json`,
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
