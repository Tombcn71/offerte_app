import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai"; // Let op: gebruik dezelfde import als je andere project
import { auth } from "@clerk/nextjs/server";

// Gebruik de SDK zoals in je werkende project
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const { projectName, clientName, items } = await req.json();

    // Mapping van items naar tekst
    const werkzaamheden = items
      .map((i: any) => `- ${i.category}: ${i.service}`)
      .join("\n");

    // Gebruik het model "gemini-3-flash" (of "gemini-3-flash-preview" zoals in je voorbeeld)
    const result = await ai.models.generateContent({
      model: "gemini-3-flash", // Of gebruik "gemini-1.5-flash" als je de andere library gebruikt
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Schrijf een professionele, korte begeleidende tekst voor een offerte.
                     Klant: ${clientName}
                     Project: ${projectName}
                     
                     Werkzaamheden:
                     ${werkzaamheden}
                     
                     Instructies:
                     - Schrijf in het Nederlands.
                     - Focus op vakmanschap en ontzorging.
                     - Maximaal 2 korte paragrafen.
                     - Geen placeholders zoals [Datum].`,
            },
          ],
        },
      ],
    });

    const text = result.text;

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    return NextResponse.json(
      { error: "AI Error: " + error.message },
      { status: 500 },
    );
  }
}
