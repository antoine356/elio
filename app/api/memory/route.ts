import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/client'

// Note : pas de SUPABASE_SERVICE_ROLE_KEY dans .env.local
// → on utilise le client anon (RLS désactivé ou permissions suffisantes sur la table memory)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json({ success: false, reason: 'no_messages' })
    }

    const supabase = createClient()

    // Lire l'ancien résumé depuis Supabase
    const { data: memoryRow } = await supabase
      .from('memory')
      .select('dynamic_summary')
      .limit(1)
      .single()

    const existingSummary = memoryRow?.dynamic_summary || ''

    // Construire la conversation de la session en texte lisible
    const sessionText = messages
      .map((m: { role: string; content: string }) =>
        `${m.role === 'user' ? 'Marie-Pierre' : 'Elio'}: ${m.content}`
      )
      .join('\n')

    // Prompt de fusion
    const fusionPrompt = existingSummary
      ? `Tu es un système de mémoire pour un assistant IA personnel. Tu dois maintenir un résumé factuel et utile sur Marie-Pierre, 58 ans, directrice d'école.

Résumé existant :
${existingSummary}

Nouvelle conversation :
${sessionText}

Génère un résumé mis à jour qui fusionne intelligemment les deux. Conserve toutes les informations durables existantes. Ajoute uniquement les informations nouvelles, précises et durables apprises dans cette conversation (humeur, sujets évoqués, préoccupations, détails sur sa vie, ses proches, ses activités). Ignore les échanges purement factuels sans valeur mémorielle. Écris en français, style télégraphique, maximum 400 tokens. Pas d'introduction, pas de conclusion, juste les faits utiles.`
      : `Tu es un système de mémoire pour un assistant IA personnel. Tu dois extraire les informations durables sur Marie-Pierre, 58 ans, directrice d'école, à partir de cette conversation.

Conversation :
${sessionText}

Extrais uniquement les informations nouvelles, précises et durables (humeur, sujets évoqués, préoccupations, détails sur sa vie, ses proches, ses activités). Ignore les échanges purement factuels sans valeur mémorielle. Écris en français, style télégraphique, maximum 400 tokens. Pas d'introduction, pas de conclusion, juste les faits utiles.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 150,
      messages: [{ role: 'user', content: fusionPrompt }],
    })

    const newSummary = response.content[0].type === 'text'
      ? response.content[0].text.trim()
      : ''

    if (!newSummary) {
      return NextResponse.json({ success: false, reason: 'empty_summary' })
    }

    // Upsert dans Supabase (remplace la ligne unique id=1)
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
