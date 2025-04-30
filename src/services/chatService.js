import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAnswer = async (userQuestion,topPages) => {
    console.log("topPages", userQuestion)

  const messages = [
    {
      role: "system",
      content: `You are an assistant that answers questions based on a document. Only use the provided content. Always include the page number when giving an answer. If the answer is not present, say "Not found."`,
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
