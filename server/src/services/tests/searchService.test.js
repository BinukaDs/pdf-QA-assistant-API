import { searchEmbeddings } from "../searchService.js";

test.only("should generate answer using userQuestion and topPages", () => {
  searchEmbeddings(
    {
      body: {
        userText: "who is the chairman?",
      },
    },
    {
      status: (code) => ({
        json: (data) => {
          expect(code).toBe(200);
          expect(data).toHaveProperty(
            "message",
            "Answer generated successfully"
          );
          expect(data).toHaveProperty("answer");
        },
      }),
    }
  );
});
