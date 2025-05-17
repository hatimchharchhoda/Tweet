import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, messageType } = await req.json();
    
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Generate different prompts based on message type
    let prompt = "";
    
    switch (messageType) {
      case "news":
        prompt = `Provide me with the latest news headlines and brief summaries (as of ${new Date().toLocaleDateString()}). Avoid bolded headings or bullet points. Focus on major global news in various categories like politics, technology, health, and entertainment. Format your response in a concise, engaging way.`;
        break;
      case "trending":
        prompt = `What topics, hashtags, or discussions are trending on social media today (${new Date().toLocaleDateString()})? Mention top 3-5 trending topics with brief context on why they're popular. Avoid bolded. Include topics from social platforms like Twitter/X, Reddit, TikTok, etc.`;
        break;
      case "world":
        prompt = `Give me important global updates from around the world as of ${new Date().toLocaleDateString()}. Avoid bolded headings or bullet points. Focus on significant international events, developments, or stories that are important on a global scale. Be concise but informative.`;
        break;
      case "general":
      default:
        // For general inquiries, use the user's original message
        prompt = `You are a news assistant. You only respond with information related to trending topics, global news, sports, technology, politics, and entertainment. Do NOT answer personal, philosophical, medical, or unrelated lifestyle questions. If asked such questions, politely decline. where user asked the question: ${message}`;
        break;
    }

    // Create a generation config
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1000,
    };

    // Use Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = result.response;
    const responseText = response.text();

    return NextResponse.json({ message: responseText });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("AI chat error:", error?.response?.data || error.message || error);
    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 }
    );
  }  
}