import { NextRequest, NextResponse } from 'next/server'
import { anthropic, buildSystemPrompt } from '@/lib/anthropic/client'
import { createClient } from '@/lib/supabase/client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, proactive, dayOfWeek, hour, season } = body

    const supabase = createClient()

    const { data: memoryData } = await supabase
      .from('memory')
      .select('dynamic_summary')
      .single()

    const dynamicSummary = memoryData?.dynamic_summary || ''
    const systemPrompt = buildSystemPrompt(dynamicSummary)

    // Appel proactif : message généré au lancement du jour
    if (proactive) {
      const momentOfDay =
        hour < 12 ? 'matin' : hour < 18 ? 'après-midi' : 'soir'

      const proactivePrompt = `Génère un message d'accueil court et naturel pour Marie-Pierre.
Contexte : on est ${dayOfWeek}, il est ${hour}h, c'est le ${season}.
Le moment de la journée est : ${momentOfDay}.
Le message doit sembler spontané et personnalisé, jamais générique.
1 à 2 phrases maximum. Pas de formule de politesse formelle.
Tu prends l'initiative, tu es curieux, tu proposes ou tu observes quelque chose de pertinent pour elle.`

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 100,
        system: systemPrompt,
        messages: [{ role: 'user', content: proactivePrompt }],
      })

      const message = response.content[0].type === 'text'
        ? response.content[0].text
        : ''

      return NextResponse.json({ message })
    }

    // Appel normal
    const recentMessages = messages.slice(-10)

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
