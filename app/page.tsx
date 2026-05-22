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
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      maxHeight: '-webkit-fill-available',
      backgroundColor: '#F5F2EF',
      overflow: 'hidden',
    }}>
      <div style={{ borderBottom: '1px solid #E5E2DF', flexShrink: 0 }}>
        <div style={{ margin: '0 auto', width: '100%', maxWidth: '672px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              backgroundColor: '#7B9E9A',
              animation: 'pulse 2s infinite',
            }} />
            <span style={{ fontSize: '14px', fontWeight: '500', letterSpacing: '0.025em', color: '#6B6B6B' }}>Elio</span>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <div style={{ margin: '0 auto', width: '100%', maxWidth: '672px', height: '100%' }}>
          <ChatInterface />
        </div>
      </div>
    </main>
  )
}
