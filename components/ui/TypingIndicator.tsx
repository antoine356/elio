export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="w-1.5 h-1.5 rounded-full bg-elio-primary animate-bounce [animation-delay:-0.3s]" />
      <div className="w-1.5 h-1.5 rounded-full bg-elio-primary animate-bounce [animation-delay:-0.15s]" />
      <div className="w-1.5 h-1.5 rounded-full bg-elio-primary animate-bounce" />
    </div>
  )
}
