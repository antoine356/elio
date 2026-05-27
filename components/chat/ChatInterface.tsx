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

const SUGGESTIONS_FALLBACK = [
  'Recommande-moi un livre',
  'Idée de repas ce soir',
  'Quoi faire ce week-end',
]

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

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>(SUGGESTIONS_FALLBACK)
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const messagesRef = useRef(messages)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const triggerMemoryUpdate = useCallback(async () => {
    const currentMessages = messagesRef.current
    const hasUserMessage = currentMessages.some((m) => m.role === 'user')
    if (!hasUserMessage) return
    try {
      await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: currentMessages }),
      })
    } catch (error) {
      console.error('Memory update failed silently:', error)
    }
  }, [])

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    inactivityTimerRef.current = setTimeout(() => {
      triggerMemoryUpdate()
    }, 30 * 60 * 1000)
  }, [triggerMemoryUpdate])

  // Sauvegarde mémoire sur mise en arrière-plan (mobile)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        triggerMemoryUpdate()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
    }
  }, [triggerMemoryUpdate])

  // Suggestions dynamiques
  const fetchSuggestions = useCallback(async () => {
    setSuggestionsLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestions: true }),
      })
      const data = await res.json()
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions)
      }
    } catch {
      // Silencieux : le fallback statique reste en place
    } finally {
      setSuggestionsLoading(false)
    }
  }, [])

  // Message proactif ou de présence à l'ouverture
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const lastProactive = localStorage.getItem('elio_last_proactive_date')

    if (lastProactive === today) {
      // Même jour : présence silencieuse, pas de message automatique
      // Les suggestions dynamiques donnent la direction
      setShowSuggestions(true)
      fetchSuggestions()
      setTimeout(() => setIsReady(true), 300)
      return
    }

    // Premier lancement du jour : message proactif
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
        // Erreur réseau : Elio reste silencieux plutôt que d'afficher un texte générique
        // Les suggestions guideront Marie-Pierre
      } finally {
        setIsLoading(false)
        setShowSuggestions(true)
        fetchSuggestions()
        setTimeout(() => setIsReady(true), 300)
      }
    }

    fetchProactive()
  }, [fetchSuggestions])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = async (content: string) => {
    setShowSuggestions(false)
    const newMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    resetInactivityTimer()
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      if (data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
        resetInactivityTimer()
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Je n\'arrive pas à te répondre en ce moment. Réessaie dans quelques instants.',
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`flex flex-col h-full transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-2" style={{ backgroundColor: '#F5F2EF' }}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {isLoading && <TypingIndicator />}
        {showSuggestions && !isLoading && (
          <SuggestionChips
            suggestions={suggestions}
            loading={suggestionsLoading}
            onSelect={(suggestion) => sendMessage(suggestion)}
          />
        )}
        <div ref={bottomRef} />
      </div>
      <InputBar onSend={sendMessage} disabled={isLoading} />
    </div>
  )
}
