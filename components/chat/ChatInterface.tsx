'use client'
import { useState, useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import InputBar from './InputBar'
import TypingIndicator from '@/components/ui/TypingIndicator'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bonjour Marie-Pierre.'
  if (hour < 18) return 'Bon après-midi, Marie-Pierre.'
  return 'Bonsoir Marie-Pierre.'
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const greeting = getGreeting()
    setMessages([{ role: 'assistant', content: greeting }])
    setTimeout(() => setIsReady(true), 300)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = async (content: string) => {
    const newMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)
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
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Désolé, une erreur est survenue. Réessaie dans un moment.'
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
        <div ref={bottomRef} />
      </div>
      <InputBar onSend={sendMessage} disabled={isLoading} />
    </div>
  )
}
