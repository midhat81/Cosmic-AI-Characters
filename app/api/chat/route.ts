import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/services/ai.service'
import { buildContextualPrompt } from '@/utils/promptBuilder'
import { getCharacterById } from '@/features/characters/character.data'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, characterId, stream = true } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    if (!characterId) {
      return NextResponse.json(
        { error: 'Character ID is required' },
        { status: 400 }
      )
    }

    const character = getCharacterById(characterId)
    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      )
    }

    const systemPrompt = buildContextualPrompt(character, messages)

    if (stream) {
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          try {
            await aiService.generateStreamingResponse(
              messages,
              systemPrompt,
              (chunk) => {
                const data = JSON.stringify({ chunk })
                controller.enqueue(encoder.encode(`data: ${data}\n\n`))
              }
            )
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
          } catch (error) {
            console.error('Streaming error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
            )
            controller.close()
          }
        },
      })

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    } else {
      const response = await aiService.generateResponse(messages, systemPrompt)

      return NextResponse.json({
        message: {
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
          characterId,
        },
      })
    }
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}