interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isAssistant = role === 'assistant'

  if (isAssistant) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
        <div style={{ maxWidth: '85%' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '500',
            color: '#7B9E9A',
            letterSpacing: '0.03em',
            marginBottom: '4px',
            marginLeft: '2px',
          }}>
            Elio
          </div>
          <div style={{
            background: '#FFFFFF',
            border: '0.5px solid #E5E2DF',
            borderRadius: '14px',
            borderBottomLeftRadius: '4px',
            padding: '10px 14px',
            fontSize: '15px',
            lineHeight: '1.5',
            color: '#1A1A1A',
          }}>
            {content}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
      <div style={{
        maxWidth: '85%',
        background: '#7B9E9A',
        borderRadius: '14px',
        borderBottomRightRadius: '4px',
        padding: '10px 14px',
        fontSize: '15px',
        lineHeight: '1.5',
        color: '#FFFFFF',
      }}>
        {content}
      </div>
    </div>
  )
}
