import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAnswer = async (userQuestion, topPages) => {
  console.log("topPages", userQuestion);

  const messages = [
    {
      role: "system",
      content: `You are a document analysis assistant. When given a user question and some document content with page numbers, 
you must find the exact answer from the provided text only.

Your response must:
- Directly quote the sentence or value from the page
- Include the page number like: "(Page 174)"
- Do not summarize or guess
- If the answer is not found, respond with: "Not found"`,
    },
    {
      role: "user",
      content: `
      User Question: ${userQuestion}
      
      Relevant Pages:
      ${topPages.map((p) => `Page ${p.page}: ${p.text}`).join("\n\n")}
      
      Answer the question based only on the pages above.`,
    },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages,
    temperature: 0,
  });
  console.log("Completion: ", completion);
  const answer = completion.choices[0].message.content;
  return answer;
};
