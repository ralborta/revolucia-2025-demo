interface ChatBubbleProps {
  autor: string;
  mensaje: string;
}

export function ChatBubble({ autor, mensaje }: ChatBubbleProps) {
  const isAgent = autor.includes("Agente");

  return (
    <div className={`flex flex-col mb-4 ${isAgent ? 'items-start' : 'items-end'}`}>
      <div className="font-semibold text-sm mb-1">{autor}</div>
      <div
        className={`rounded-lg p-3 max-w-xs whitespace-pre-wrap ${
          isAgent
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        {mensaje}
      </div>
    </div>
  );
} 