import { NextRequest, NextResponse } from 'next/server'
import { anthropic, buildSystemPrompt } from '@/lib/anthropic/client'
import { createClient } from '@/lib/supabase/client'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const supabase = createClient()

    const { data: memoryData } = await supabase
      .from('memory')
      .select('dynamic_summary')
      .single()

    const dynamicSummary = memoryData?.dynamic_summary || ''
    const systemPrompt = buildSystemPrompt(dynamicSummary)

    const recentMessages = messages.slice(-6)

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: recentMessages,
    })

    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : ''

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
