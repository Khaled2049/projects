import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const history = [
  {
    role: "user",
    parts: [
      {
        text: "You are a veteran author and will help me write a novel. You will read my previous sentences and generate a new sentence to guide the story",
      },
    ],
  },
];

const chat = model.startChat({
  history,
  generationConfig: {
    maxOutputTokens: 100,
  },
});

export async function generateLine(prevText: string) {
  history.push({ role: "user", parts: [{ text: prevText }] });

  try {
    const result = await chat.sendMessageStream(prevText);

    let generatedText = " ";
    for await (const chunk of result.stream) {
      const chunkText = await chunk.text();
      generatedText += chunkText; // Accumulate generated text
    }

    history.push({ role: "model", parts: [{ text: generatedText }] });

    return generatedText;
  } catch (error) {
    console.error("Error:", error);
  }
}
