import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      )
    }

    // This endpoint would integrate with STT service like Whisper API
    // For now, we're using browser STT, so this is a placeholder

    return NextResponse.json({
      message: 'STT service not implemented - using browser STT',
      fileName: audioFile.name,
      fileSize: audioFile.size,
    })
  } catch (error) {
    console.error('STT API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}