import { NextRequest, NextResponse } from 'next/server';
import { Mistral } from "@mistralai/mistralai";

// Initialize Mistral client (server-side only)
const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY // Use server-side env variable
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    const chatResponse = await mistral.chat.complete({
      model: "mistral-medium",
      messages: [{ role: "user", content: text }],
    });

    return NextResponse.json({ 
      text: chatResponse.choices[0].message.content 
    });
  } catch (error) {
    console.error('Chat completion error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
