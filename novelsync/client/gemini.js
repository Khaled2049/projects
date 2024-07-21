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

export function setUpGemini(element, loadingIndicator) {
  let lastUserInput = ""; // Track the last user input
  let lastGeneratedText = ""; // Track the last generated text

  element.addEventListener("keydown", async function (event) {
    if (event.key === "Tab") {
      event.preventDefault();
      const userInput = element.value;

      // Get only the new input by excluding the last generated text
      const newInput = userInput.replace(lastGeneratedText, "").trim();

      if (newInput) {
        history.push({ role: "user", parts: [{ text: newInput }] });
        loadingIndicator.style.display = "inline";
        try {
          const result = await chat.sendMessageStream(newInput);

          let generatedText = "";
          for await (const chunk of result.stream) {
            const chunkText = await chunk.text();
            generatedText += chunkText; // Accumulate generated text
          }

          history.push({ role: "model", parts: [{ text: generatedText }] });

          // Append generated text with a leading space
          element.value += " " + generatedText;

          // Update the last user input and last generated text
          lastUserInput = userInput + " " + generatedText;
          lastGeneratedText = generatedText;
        } catch (error) {
          console.error("Error:", error);
        } finally {
          loadingIndicator.style.display = "none";
        }
      }
    }
  });
}
