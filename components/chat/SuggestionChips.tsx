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
