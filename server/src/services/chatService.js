import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAnswer = async (userQuestion, topPages) => {
  // console.log("topPages", userQuestion);

  const messages = [
    {
      role: "system",
      content: `
      You are a document analysis assistant. When given a user question and some document content with page numbers, 
      you must find the most similar answers from the provided text only and.

      Your response must:
      - Directly quote the sentence or value from the Pages
      - Truncate the quote limiting it to 50 letters. and put "...". And Don't include the whole paragraph.
      - Include the page number like: "(Page 174)"
      - If the answer is found in multiple pages, include them all one by one.
      - Format the answer like this: 
          "quote..."(Page 174),
          "quote..."(Page 74),
          "quote..."(Page 245)
      - calculate the pageNumber always (pagenumber - 3)
      - Do not summarize or guess 
      - If the answer is not found, respond with: "Not found"
    `,
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
  // console.log("Completion: ", completion);
  const answer = completion.choices[0].message.content;
  return answer;
};
