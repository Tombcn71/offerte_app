import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { auth } from "@clerk/nextjs/server";

// We initialiseren de AI met v1 om de 404/v1beta fouten te omzeilen
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { apiVersion: "v1" },
});

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

    // We gebruiken het model uit jouw voorbeeld
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Schrijf een korte, professionele introductie voor een offerte in het Nederlands.
                     Klant: ${clientName}
                     Project: ${projectName}
                     Werkzaamheden:
                     ${werkzaamheden}
                     
                     Instructies: Maximaal 2 korte alinea's, geen placeholders.`,
            },
          ],
        },
      ],
    });

    // In de @google/genai SDK is de tekst direct beschikbaar op de response
    const text = response.text;

    if (!text) {
      throw new Error("Geen tekst ontvangen van de AI");
    }

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini 3 API Error:", error);
    return NextResponse.json(
      { error: "AI Error: " + error.message },
      { status: 500 },
    );
  }
}
