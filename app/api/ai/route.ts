import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // For now, just echo back the last message
    // TODO: Implement actual OpenAI chat completion
    const lastMessage = messages[messages.length - 1]
    
    return NextResponse.json({
      role: 'assistant',
      content: `I received your message: "${lastMessage.content}"`
    })

  } catch (error) {
    console.error('AI API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
