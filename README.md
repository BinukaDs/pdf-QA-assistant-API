# 📄 PDF Question Answering Web App (Node.js + OpenAI)

This project is a full-stack backend application that allows users to ask questions about the contents of a PDF file (such as an annual report) and get accurate, page-specific answers powered by OpenAI's GPT API.

It uses:
- 🔍 OpenAI Embedding API (`text-embedding-ada-002`) for semantic document search
- 🧠 OpenAI Chat API (`gpt-4-turbo`) for generating natural language responses
- 📄 `pdf-parse` for reading and extracting text from PDF documents
- 🟦 Node.js + TypeScript for building the server and processing logic

---

## ✨ Features

- Extracts and indexes content from a PDF file
- Matches user questions to relevant pages using vector similarity
- Returns answers quoting directly from the PDF with page numbers
- Clean backend architecture ready for frontend integration

---

## 🛠 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/pdf-qa-assistant.git
cd pdf-qa-assistant
```
### 2. Install Dependencies
```bash
npm install
```

### 3. Create a .env File
```env
OPENAI_API_KEY=your-openai-api-key
PORT=3000
```

## 🔐 Requirements

    ### Node.js (v16 or higher)

    An OpenAI account with access to:

        - text-embedding-ada-002 (for vector search)
        - gpt-4-turbo or gpt-3.5-turbo (for answering)