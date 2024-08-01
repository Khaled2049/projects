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
export async function generateSuggestions(desire: string): Promise<string[]> {
  try {
    const prompt = `Given the desire "${desire}", provide 5 specific suggestions or topics to write about. Return only the numbered list of suggestions, with no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Split the text into an array of suggestions
    const suggestions = text
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((line) => line.length > 0);

    // Ensure we have exactly 5 suggestions
    if (suggestions.length < 5) {
      throw new Error("Not enough suggestions generated");
    }
    return suggestions.slice(0, 5);
  } catch (error) {
    console.error("Error generating suggestions:", error);
    throw error;
  }
}
