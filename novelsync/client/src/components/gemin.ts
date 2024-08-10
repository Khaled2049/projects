import {
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
} from "@google/generative-ai";

export class AITextGenerator {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private chat: ChatSession;
  private history: { role: string; parts: { text: string }[] }[];

  constructor() {
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    this.history = [
      {
        role: "user",
        parts: [
          {
            text: "You are a veteran author and will help me write a novel. You will read my previous sentences and generate a new sentence to guide the story. Always generate exactly one sentence.",
          },
        ],
      },
    ];
    this.chat = this.model.startChat({
      history: this.history,
      generationConfig: {
        maxOutputTokens: 100,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });
  }

  async generateLine(prevText: string): Promise<string> {
    const lines = prevText.split("\n").slice(-5).join("\n");
    const prompt = `Based on the following context, generate exactly one sentence to continue the story:\n\n${lines}\n\nContinue with one sentence:`;
    this.history.push({ role: "user", parts: [{ text: prompt }] });

    try {
      const result = await this.chat.sendMessage(prompt);
      const generatedText = result.response.text().trim();
      const sentences = generatedText.split(/[.!?]+/);
      const singleSentence =
        sentences[0] + (generatedText.match(/[.!?]+/) || ["."])[0];
      this.history.push({ role: "model", parts: [{ text: singleSentence }] });
      return " " + singleSentence;
    } catch (error) {
      console.error("Error:", error);
      return "";
    }
  }

  async generateFromSuggestion(suggestion: string): Promise<string> {
    const prompt = `Based on the suggestion "${suggestion}", generate exactly two sentences to start a story Suggestion: ${suggestion}\n\nContinue with two sentences:`;
    this.history.push({ role: "user", parts: [{ text: prompt }] });

    try {
      const result = await this.chat.sendMessage(prompt);
      const generatedText = result.response.text().trim();
      const sentences =
        generatedText
          .split(/[.!?]+/)
          .slice(0, 2)
          .join(". ") + ".";
      this.history.push({ role: "model", parts: [{ text: " " + sentences }] });
      return sentences;
    } catch (error) {
      console.error("Error:", error);
      return "";
    }
  }

  async generateSuggestions(desire: string): Promise<string[]> {
    try {
      const prompt = `Given the desire "${desire}", provide 5 specific suggestions or topics to write about. Return only the numbered list of suggestions, with no additional text.`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const suggestions = text
        .split("\n")
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter((line) => line.length > 0);

      if (suggestions.length < 5) {
        throw new Error("Not enough suggestions generated");
      }
      return suggestions.slice(0, 5);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      throw error;
    }
  }

  setAiBuddy(id: number) {
    console.log(id);
  }
}
