'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import MessageBubble from './MessageBubble'
import InputBar from './InputBar'
import TypingIndicator from '@/components/ui/TypingIndicator'
import SuggestionChips from './SuggestionChips'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  'Recommande-moi un livre',
  'Idée de repas ce soir',
  'Quoi faire ce week-end',
  'Météo aujourd\'hui',
]

function getDateContext(): { dayOfWeek: string; hour: number; season: string } {
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

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // ── Mémoire dynamique ──────────────────────────────────────────────────────
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const messagesRef = useRef(messages)

  // Maintenir messagesRef synchronisé avec messages
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const triggerMemoryUpdate = useCallback(async () => {
    const currentMessages = messagesRef.current
    // Ne déclencher que si la conversation a au moins un message utilisateur
    const hasUserMessage = currentMessages.some((m) => m.role === 'user')
    if (!hasUserMessage) return

    try {
      await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: currentMessages }),
      })
    } catch (error) {
      // Silencieux : la mémoire est best-effort, pas bloquante
      console.error('Memory update failed silently:', error)
    }
  }, [])

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    inactivityTimerRef.current = setTimeout(() => {
      triggerMemoryUpdate()
    }, 30 * 60 * 1000) // 30 minutes
  }, [triggerMemoryUpdate])

  // Nettoyer le timer au démontage
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
    }
  }, [])
  // ── Fin mémoire dynamique ──────────────────────────────────────────────────

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const lastProactive = localStorage.getItem('elio_last_proactive_date')

    if (lastProactive === today) {
      // Déjà fait aujourd'hui : greeting statique
      const { hour } = getDateContext()
      let greeting = 'Bonjour Marie-Pierre.'
      if (hour >= 12 && hour < 18) greeting = 'Bon après-midi, Marie-Pierre.'
      else if (hour >= 18) greeting = 'Bonsoir Marie-Pierre.'
      setMessages([{ role: 'assistant', content: greeting }])
      setShowSuggestions(true)
      setTimeout(() => setIsReady(true), 300)
      return
    }

    // Premier lancement du jour : message proactif généré par l'API
    const fetchProactive = async () => {
      setIsLoading(true)
      try {
        const { dayOfWeek, hour, season } = getDateContext()
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            proactive: true,
            dayOfWeek,
            hour,
            season,
            messages: [],
          }),
        })
        const data = await res.json()
        if (data.message) {
          setMessages([{ role: 'assistant', content: data.message }])
          localStorage.setItem('elio_last_proactive_date', today)
        }
      } catch {
        const { hour } = getDateContext()
        let greeting = 'Bonjour Marie-Pierre.'
        if (hour >= 12 && hour < 18) greeting = 'Bon après-midi, Marie-Pierre.'
        else if (hour >= 18) greeting = 'Bonsoir Marie-Pierre.'
        setMessages([{ role: 'assistant', content: greeting }])
      } finally {
        setIsLoading(false)
        setShowSuggestions(true)
        setTimeout(() => setIsReady(true), 300)
      }
    }

    fetchProactive()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = async (content: string) => {
    setShowSuggestions(false)
    const newMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    resetInactivityTimer() // ← réinitialise après ajout du message utilisateur
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      if (data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
        resetInactivityTimer() // ← réinitialise après ajout de la réponse d'Elio
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Désolé, une erreur est survenue. Réessaie dans un moment.',
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`flex flex-col h-full transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-2">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {isLoading && <TypingIndicator />}
        {showSuggestions && !isLoading && (
          <SuggestionChips
            suggestions={SUGGESTIONS}
            onSelect={(suggestion) => sendMessage(suggestion)}
          />
        )}
        <div ref={bottomRef} />
      </div>
      <InputBar onSend={sendMessage} disabled={isLoading} />
    </div>
  )
}
