import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { auth } from "@clerk/nextjs/server";

// Initialisatie van de AI (Gemini 3 Flash)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    // 1. Auth check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    // 2. Input ophalen uit het offerteformulier
    const { projectName, clientName, items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Geen werkzaamheden gevonden" },
        { status: 400 },
      );
    }

    // Formatteer de werkzaamheden voor de AI
    const werklijst = items
      .map((i: any) => `- ${i.category}: ${i.service}`)
      .join("\n");

    // 3. AI Analyse / Generatie
    // We gebruiken exact dezelfde aanroep als in je honden-app
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Jij bent een AI Business Expert voor aannemers en vakmensen.
                     Schrijf een professionele, overtuigende introductie voor een offerte.
                     
                     Klant: ${clientName}
                     Project: ${projectName}
                     Werkzaamheden:
                     ${werklijst}

                     STRICTE INSTRUCTIES:
                     - Schrijf in het Nederlands.
                     - Focus op vakmanschap, betrouwbaarheid en ontzorging.
                     - Maximaal 2 korte, krachtige alinea's.
                     - Gebruik GEEN placeholders (zoals [Naam] of [Datum]).
                     - De tekst moet direct bruikbaar zijn in een offerte-brief.`,
            },
          ],
        },
      ],
    });

    const text = result.text;
    if (!text) throw new Error("Lege response van AI");

    // We hoeven hier geen JSON te parsen omdat we pure tekst teruggeven aan de textarea
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Offerte AI Error:", error);
    return NextResponse.json(
      { error: "Fout bij genereren: " + error.message },
      { status: 500 },
    );
  }
}
