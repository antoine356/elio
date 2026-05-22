interface SuggestionChipsProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
}

export default function SuggestionChips({ suggestions, onSelect }: SuggestionChipsProps) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginLeft: '0.75rem',
      marginTop: '4px',
      marginBottom: '8px',
    }}>
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          style={{
            border: '1px solid #E5E2DF',
            borderRadius: '9999px',
            backgroundColor: '#FAF9F6',
            color: '#6B6B6B',
            fontSize: '14px',
            padding: '6px 14px',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0EDEA')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FAF9F6')}
        >
          {suggestion}
        </button>
      ))}
    </div>
  )
}
