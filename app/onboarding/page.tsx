'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const PHRASES: { text: string; pauseAfter: number }[] = [
  { text: 'Bonjour Marie-Pierre.',                                                                       pauseAfter: 600  },
  { text: 'Je suis Elio, ton assistant personnel.',                                                      pauseAfter: 400  },
  { text: "Capable de répondre à tes questions, te suggérer des idées, t'accompagner au quotidien.",     pauseAfter: 500  },
  { text: 'Antoine a pensé à toi en me créant.',                                                         pauseAfter: 2000 },
]

const CHAR_SPEED = 35

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default function OnboardingPage() {
  const router = useRouter()
  const [lines, setLines] = useState<string[]>([])
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('elio_onboarded')) {
      router.replace('/')
      return
    }

    async function run() {
      for (let i = 0; i < PHRASES.length; i++) {
        const { text, pauseAfter } = PHRASES[i]

        // Ajoute une ligne vide pour cette phrase
        setLines(prev => [...prev, ''])

        // Attendre que React ait validé l'ajout avant de commencer à la remplir
        await delay(CHAR_SPEED)

        for (let j = 1; j <= text.length; j++) {
          setLines(prev => {
            const next = [...prev]
            next[i] = text.slice(0, j)
            return next
          })
          await delay(CHAR_SPEED)
        }

        await delay(pauseAfter)
      }

      // Fondu sortant
      setFading(true)
      await delay(800)

      localStorage.setItem('elio_onboarded', 'true')
      router.replace('/')
    }

    run()
  }, [router])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#1A1A1A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 800ms ease',
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '32rem',
          width: '100%',
          padding: '0 1.25rem',
          textAlign: 'center',
        }}
      >
        {lines.map((line, i) => (
          <p
            key={i}
            style={{
              color: '#FAF9F6',
              fontWeight: 300,
              marginBottom: i < lines.length - 1 ? '1.5rem' : 0,
              minHeight: '1.5em',
            }}
            className="text-2xl sm:text-3xl"
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}
