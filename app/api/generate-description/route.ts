import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { auth } from "@clerk/nextjs/server";

// We gebruiken hier de GoogleGenAI class van de @google/genai package
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const { projectName, clientName, items } = await req.json();

    const werkzaamheden = items
      .map((i: any) => `- ${i.category}: ${i.service}`)
      .join("\n");

    // We roepen hier expliciet gemini-3-flash aan
    const result = await ai.models.generateContent({
      model: "gemini-3-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Schrijf een professionele introductie voor een offerte.
                     Klant: ${clientName}
                     Project: ${projectName}
                     Werkzaamheden:
                     ${werkzaamheden}
                     
                     Instructies:
                     - Taal: Nederlands.
                     - Maximaal 2 paragrafen.
                     - Geen placeholders zoals [Naam].`,
            },
          ],
        },
      ],
    });

    // Let op: bij @google/genai is de response direct beschikbaar via result.text
    const text = result.text;

    if (!text) {
      throw new Error("Geen tekst gegenereerd door AI");
    }

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini 3 Error:", error);
    return NextResponse.json(
      { error: "AI Error: " + error.message },
      { status: 500 },
    );
  }
}
