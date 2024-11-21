import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client (server-side only)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Use server-side env variable
});

export async function POST(request: NextRequest) {
  try {
    // Get the audio file from the request
    const formData = await request.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      console.error('No audio file provided in request');
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert Blob/File to a Buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a file object that OpenAI can process
    const file = {
      buffer,
      name: 'audio.webm',
      type: 'audio/webm',
    };

    console.log('Attempting to transcribe audio file...');
    // Transcribe using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: file as any, // Type assertion needed due to OpenAI types
      model: 'whisper-1',
    });

    console.log('Transcription successful:', transcription.text);
    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    // Detailed error logging
    console.error('Transcription error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error,
    });

    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid API key configuration' },
          { status: 401 }
        );
      }
      if (error.message.includes('file format')) {
        return NextResponse.json(
          { error: 'Invalid audio file format' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to transcribe audio. Please try again.' },
      { status: 500 }
    );
  }
}
