import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json({ success: false, reason: 'no_messages' })
    }

    const supabase = createServerClient()

    const { data: memoryRow } = await supabase
      .from('memory')
      .select('dynamic_summary')
      .limit(1)
      .single()

    const existingSummary = memoryRow?.dynamic_summary || ''

    const sessionText = messages
      .map((m: { role: string; content: string }) =>
        `${m.role === 'user' ? 'Marie-Pierre' : 'Elio'}: ${m.content}`
      )
      .join('\n')

    const fusionPrompt = existingSummary
      ? `Tu es un système de mémoire pour un assistant IA personnel. Maintiens un résumé factuel et utile sur Marie-Pierre, 58 ans, directrice d'école.

Résumé existant :
${existingSummary}

Nouvelle conversation :
${sessionText}

Génère un résumé mis à jour qui fusionne intelligemment les deux. Conserve toutes les informations durables. Ajoute uniquement les informations nouvelles et durables apprises dans cette conversation : humeur, sujets évoqués, préoccupations, détails sur sa vie, ses proches, ses activités, ses préférences de ton ou de style avec Elio. Ignore les échanges purement factuels sans valeur mémorielle. Écris en français, style télégraphique, maximum 300 mots. Pas d'introduction, pas de conclusion, juste les faits utiles.`
      : `Tu es un système de mémoire pour un assistant IA personnel. Extrais les informations durables sur Marie-Pierre, 58 ans, directrice d'école, à partir de cette conversation.

Conversation :
${sessionText}

Extrais uniquement les informations nouvelles et durables : humeur, sujets évoqués, préoccupations, détails sur sa vie, ses proches, ses activités, ses préférences de ton ou de style avec Elio. Ignore les échanges purement factuels sans valeur mémorielle. Écris en français, style télégraphique, maximum 300 mots. Pas d'introduction, pas de conclusion, juste les faits utiles.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 400,
      messages: [{ role: 'user', content: fusionPrompt }],
    })

    const newSummary = response.content[0].type === 'text'
      ? response.content[0].text.trim()
      : ''

    if (!newSummary) {
      return NextResponse.json({ success: false, reason: 'empty_summary' })
    }

    const { error } = await supabase
      .from('memory')
      .update({ dynamic_summary: newSummary, updated_at: new Date().toISOString() })
      .eq('id', '95697bff-d201-448c-83b1-8acc5342471a')

    if (error) {
      console.error('Supabase upsert error:', error)
      return NextResponse.json({ success: false, reason: 'supabase_error' })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Memory route error:', error)
    return NextResponse.json({ success: false, reason: 'unexpected_error' })
  }
}
