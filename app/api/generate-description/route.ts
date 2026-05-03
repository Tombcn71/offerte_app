import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { projectName, clientName, items } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Schrijf een professionele introductie en werkomschrijving voor een offerte.
      Klantnaam: ${clientName}
      Project: ${projectName}
      Werkzaamheden: ${items.map((i: any) => i.description).join(", ")}

      Stijl: Professioneel, betrouwbaar, Nederlands. 
      Focus op vakmanschap en ontzorging. Maak het geen lange brief, maar 2 krachtige paragrafen.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: "AI Error" }, { status: 500 });
  }
}
