import { NextResponse } from 'next/server'
import { CHARACTERS, getCharacterById } from '@/features/characters/character.data'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const character = getCharacterById(id)
      if (!character) {
        return NextResponse.json(
          { error: 'Character not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ character })
    }

    return NextResponse.json({ characters: CHARACTERS })
  } catch (error) {
    console.error('Characters API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}