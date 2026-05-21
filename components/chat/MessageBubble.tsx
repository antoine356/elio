interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isAssistant = role === 'assistant'

  return (
    <div
      style={{ display: 'flex', width: '100%', justifyContent: isAssistant ? 'flex-start' : 'flex-end', marginBottom: '12px' }}
    >
      <div
        style={{
          maxWidth: '75%',
          padding: '10px 14px',
          fontSize: '15px',
          lineHeight: '1.6',
          borderRadius: isAssistant ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
          backgroundColor: isAssistant ? '#F0EDEA' : '#7B9E9A',
          color: isAssistant ? '#1A1A1A' : 'white',
          borderLeft: isAssistant ? '2px solid #7B9E9A' : 'none',
          wordBreak: 'break-word',
        }}
      >
        {content}
      </div>
    </div>
  )
}
