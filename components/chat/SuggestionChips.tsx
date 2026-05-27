interface SuggestionChipsProps {
  suggestions: string[]
  loading?: boolean
  onSelect: (suggestion: string) => void
}

export default function SuggestionChips({ suggestions, loading = false, onSelect }: SuggestionChipsProps) {
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginLeft: '2px',
        marginTop: '4px',
        marginBottom: '8px',
      }}>
        {[90, 120, 100].map((width, i) => (
          <div
            key={i}
            style={{
              width: `${width}px`,
              height: '32px',
              borderRadius: '9999px',
              backgroundColor: '#EEEBE8',
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginLeft: '2px',
      marginTop: '4px',
      marginBottom: '8px',
    }}>
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          style={{
            border: '0.5px solid #E5E2DF',
            borderRadius: '9999px',
            backgroundColor: '#FFFFFF',
            color: '#6B6B6B',
            fontSize: '14px',
            padding: '6px 14px',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F5F2EF')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
        >
          {suggestion}
        </button>
      ))}
    </div>
  )
}
