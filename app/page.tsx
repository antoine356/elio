'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ChatInterface from '@/components/chat/ChatInterface'

export default function Home() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('elio_onboarded')) {
      router.replace('/onboarding')
    } else {
      setReady(true)
    }
  }, [router])

  if (!ready) {
    return (
      <div style={{ position: 'fixed', inset: 0, backgroundColor: '#1A1A1A' }} />
    )
  }

  return (
    <main className="flex flex-col h-screen" style={{ backgroundColor: '#F5F2EF' }}>
      <div className="flex-none w-full" style={{ borderBottom: '1px solid #E5E2DF' }}>
        <div className="mx-auto w-full max-w-2xl px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#7B9E9A' }} />
            <span className="text-sm font-medium tracking-wide" style={{ color: '#6B6B6B' }}>Elio</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="mx-auto w-full max-w-2xl h-full">
          <ChatInterface />
        </div>
      </div>
    </main>
  )
}
