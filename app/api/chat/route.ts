import { NextRequest, NextResponse } from 'next/server'
import { anthropic, buildSystemPrompt } from '@/lib/anthropic/client'
import { createClient } from '@/lib/supabase/client'

function getDateContext() {
  const now = new Date()
  const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
  const dayOfWeek = days[now.getDay()]
  const hour = now.getHours()
  const month = now.getMonth()
  let season = 'printemps'
  if (month >= 5 && month <= 7) season = 'été'
  else if (month >= 8 && month <= 10) season = 'automne'
  else if (month >= 11 || month <= 1) season = 'hiver'
  return { dayOfWeek, hour, season }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, proactive, suggestions } = body

    const supabase = createClient()

    const { data: memoryData } = await supabase
      .from('memory')
      .select('dynamic_summary')
      .single()

    const dynamicSummary = memoryData?.dynamic_summary || ''
    const systemPrompt = buildSystemPrompt(dynamicSummary)

    // Message proactif du jour
    if (proactive) {
      const { dayOfWeek, hour, season } = getDateContext()
      const momentOfDay = hour < 12 ? 'matin' : hour < 18 ? 'après-midi' : 'soir'
      const proactivePrompt = `Génère un message d'accueil court et naturel pour Marie-Pierre.
Contexte : on est ${dayOfWeek}, il est ${hour}h, c'est le ${season}. Moment de la journée : ${momentOfDay}.
Le message doit sembler spontané et personnalisé, jamais générique.
1 à 2 phrases maximum. Pas de formule de politesse formelle.
Tu prends l'initiative : tu es curieux, tu proposes ou tu observes quelque chose de pertinent pour elle aujourd'hui.
Si tu as des informations récentes sur elle dans ta mémoire, utilise-les subtilement.`

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 120,
        system: systemPrompt,
        messages: [{ role: 'user', content: proactivePrompt }],
      })
      const message = response.content[0].type === 'text' ? response.content[0].text : ''
      return NextResponse.json({ message })
    }

    // Suggestions dynamiques contextuelles
    if (suggestions) {
      const { dayOfWeek, hour, season } = getDateContext()
      const momentOfDay = hour < 12 ? 'matin' : hour < 18 ? 'après-midi' : 'soir'
      const memoryContext = dynamicSummary
        ? `Ce que tu sais d'elle récemment : ${dynamicSummary}`
        : ''
      const suggestionsPrompt = `Génère exactement 3 suggestions de conversation courtes et pertinentes pour Marie-Pierre.
Contexte : ${dayOfWeek}, ${momentOfDay}, ${season}.
${memoryContext}

Règles :
* Chaque suggestion est une question ou une demande courte (4 à 7 mots maximum)
* Variées : ne propose pas 3 suggestions du même registre
* Ancrées dans sa vie réelle et le contexte du moment
* Naturelles, jamais génériques, jamais artificielles
* Exemples de bons registres : lecture, violon, cuisine, week-end, Gary et Mina, randonnée à venir, actualité douce

Réponds uniquement avec les 3 suggestions, une par ligne, sans numérotation, sans ponctuation finale, sans guillemets.`

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 80,
        system: systemPrompt,
        messages: [{ role: 'user', content: suggestionsPrompt }],
      })
      const raw = response.content[0].type === 'text' ? response.content[0].text : ''
      const suggestionsList = raw
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .slice(0, 3)
      return NextResponse.json({ suggestions: suggestionsList })
    }

    // Message conversationnel standard
    const recentMessages = messages.slice(-10)
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: recentMessages,
    })
    const assistantMessage = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ message: assistantMessage })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
