import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    hasMistralKey: !!process.env.MISTRAL_API_KEY,
  });
}
