import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const history = [
  {
    role: "user",
    parts: [
      {
        text: "You are a veteran author and will help me write a novel. You will read my previous sentences and generate a new sentence to guide the story. Always generate exactly one sentence.",
      },
    ],
  },
];

const chat = model.startChat({
  history,
  generationConfig: {
    maxOutputTokens: 100,
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
  },
});

export async function generateLine(prevText: string) {
  // Split the previous text into lines and take the last 5
  const lines = prevText.split("\n").slice(-5).join("\n");

  // Update the prompt to emphasize generating a single line
  const prompt = `Based on the following context, generate exactly one sentence to continue the story:\n\n${lines}\n\nContinue with one sentence:`;

  history.push({ role: "user", parts: [{ text: prompt }] });

  try {
    const result = await chat.sendMessage(prompt);
    const generatedText = result.response.text().trim();

    // Ensure only one sentence is returned
    const sentences = generatedText.split(/[.!?]+/);
    const singleSentence =
      sentences[0] + (generatedText.match(/[.!?]+/) || ["."])[0];

    history.push({ role: "model", parts: [{ text: singleSentence }] });
    return " " + singleSentence;
  } catch (error) {
    console.error("Error:", error);
    return "";
  }
}

export async function generateFromSuggestion(suggestion: string) {
  // Split the previous text into lines and take the last 5

  // Update the prompt to generate two sentences based on the suggestion
  const prompt = `Based on the suggestion "${suggestion}", generate exactly two sentences to start a story Suggestion: ${suggestion}\n\nContinue with two sentences:`;

  history.push({ role: "user", parts: [{ text: prompt }] });

  try {
    const result = await chat.sendMessage(prompt);
    const generatedText = result.response.text().trim();

    // Ensure two sentences are returned
    const sentences =
      generatedText
        .split(/[.!?]+/)
        .slice(0, 2)
        .join(". ") + ".";

    // Add a space before returning the sentences
    history.push({ role: "model", parts: [{ text: " " + sentences }] });
    return sentences;
  } catch (error) {
    console.error("Error:", error);
    return "";
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

export async function setAiBuddy(id: number) {
  if (id === 0) {
    return generateLine;
  }
}
