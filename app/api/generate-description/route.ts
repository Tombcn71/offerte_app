import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialiseer de AI buiten de handler voor betere performance
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    // 1. Controleer of de API key aanwezig is
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is niet geconfigureerd" },
        { status: 500 },
      );
    }

    const { projectName, clientName, items } = await req.json();

    // 2. Basis validatie
    if (!projectName || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Onvoldoende gegevens om tekst te genereren" },
        { status: 400 },
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Geoptimaliseerde prompt (let op de item mapping)
    const prompt = `
      Je bent een professionele Nederlandse aannemer. Schrijf een overtuigende, korte begeleidende tekst voor een offerte.
      
      Details:
      Klant: ${clientName || "de klant"}
      Project: ${projectName}
      Diensten: ${items.map((i: any) => `${i.category} (${i.service})`).join(", ")}

      Instructies:
      - Schrijf in het Nederlands.
      - Gebruik exact 2 korte paragrafen.
      - Paragraaf 1: Bedank de klant voor de aanvraag en refereer aan de professionaliteit van het project ${projectName}.
      - Paragraaf 2: Leg de focus op kwaliteit, vakmanschap en dat de klant volledig wordt ontzorgd.
      - Houd de toon zakelijk maar benaderbaar.
      - Gebruik GEEN placeholders zoals [Datum] of [Bedrijfsnaam]. Begin direct met de tekst.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // 4. Optionele schoonmaak: Verwijder eventuele Markdown sterretjes die Gemini soms toevoegt
    text = text.replace(/\*\*/g, "");

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het genereren van de tekst." },
      { status: 500 },
    );
  }
}
