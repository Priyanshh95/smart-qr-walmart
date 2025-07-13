import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔒 Replace this with your actual Gemini API key
const GEMINI_API_KEY = "AIzaSyA7vouIF91_fK-ugIUtQd_OMlgW75QyonM";

if (!GEMINI_API_KEY) {
  throw new Error("Gemini API key is not defined.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getAIBasedPrice(product) {
  const prompt = `
You are a pricing assistant AI. Based on the product details below, suggest an optimal price in Indian Rupees (₹), and also explain your reasoning.

Product Details:
- Name: ${product.name}
- Ingredients: ${product.ingredients}
- Tracking ID: ${product.trackingId}
- Packed On: ${product.packedOnDate}
- Expiry Date: ${product.expiryDate}
- Current Price: ₹${product.price}

Pricing Guidelines:
- If the product is close to its expiry date (within 7 days), reduce the price to encourage quick sales.
- If the product is newly packed or still fresh, price can remain or increase slightly.
- Use simple and clear logic in your explanation.
- Your response must start with the new price (₹) on the first line, followed by a short explanation (2-3 lines max).

Example output:

₹145.00  
This price was suggested because the product is still fresh (expiry is 20 days away). A slight increase from the current price is reasonable due to high shelf life.

Now, generate the result:
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();

  // Split the price and explanation
  const [firstLine, ...rest] = text.trim().split("\n");
  const suggestedPrice = parseFloat(firstLine.replace(/[₹\s]/g, ""));
  const explanation = rest.join(" ").trim();

  return {
    suggestedPrice: suggestedPrice || product.price,
    explanation: explanation || "No explanation provided."
  };
}
