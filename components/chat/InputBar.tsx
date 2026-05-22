'use client'
import { useState, useRef } from 'react'

interface InputBarProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function InputBar({ onSend, disabled }: InputBarProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  return (
    <div style={{ borderTop: '1px solid #E5E2DF', backgroundColor: '#F5F2EF' }} className="px-4 py-3">
      <div style={{
        background: '#FFFFFF',
        border: '0.5px solid #E5E2DF',
        borderRadius: '9999px',
        padding: '6px 8px 6px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Écris quelque chose..."
          disabled={disabled}
          rows={1}
          style={{ color: '#1A1A1A' }}
          className="flex-1 bg-transparent resize-none outline-none text-[15px] placeholder:opacity-40 max-h-32 py-1 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          style={{
            background: '#7B9E9A',
            border: 'none',
            borderRadius: '9999px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            opacity: (disabled || !value.trim()) ? 0.3 : 1,
            transition: 'opacity 0.15s ease',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 12V2M7 2L2 7M7 2L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
