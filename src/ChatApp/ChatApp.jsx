import React, { useState } from 'react';
import './ChatApp.css';

const SUGGESTED_PROMPTS = [
  'Explícame qué hace este código',
  'Ayúdame a depurar un error de CORS',
  'Genera un componente React con hooks',
];

export default function ChatApp({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
    };

    // Añadir mensaje del usuario inmediatamente
    setMessages((prev) => [...prev, userMessage]);

    // Limpiar input
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error('Error al conectar con Qwen');
      }

      const data = await response.json();

      // Compatibilidad con distintos formatos de respuesta de Ollama
      const assistantMessage = {
        role: 'assistant',
        content:
          data?.message?.content || // formato /api/chat
          data?.response || // formato /api/generate
          data?.content || // formato simple
          '⚠️ El modelo no devolvió contenido.',
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error en el chat:', error);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            '❌ Error: No se pudo obtener respuesta de Qwen. Revisa la terminal de Ollama y el backend /api/chat.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="qwen-chat-container">
      {/* HEADER */}
      <div className="qwen-chat-header">
        <button
          type="button"
          onClick={onBack}
          className="qwen-chat-back"
          aria-label="Volver al inicio"
        >
          ← Inicio
        </button>

        <div className="qwen-chat-header__info">
          <h2 className="qwen-chat-title">AI DeveLopez</h2>
          <span className="qwen-chat-status">
            API activa en localhost:11434 - Daniel López
          </span>
        </div>
      </div>

      {/* VENTANA DE CHAT */}
      <div className="qwen-chat-window">
        {/* Pantalla vacía */}
        {messages.length === 0 && (
          <div className="qwen-chat-empty">
            <p className="qwen-chat-empty__title">
              ¿En qué estás trabajando?
            </p>

            <div className="qwen-chat-empty__prompts">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="qwen-chat-empty__prompt"
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MENSAJES */}
        {messages
          .filter((msg) => msg && msg.role && msg.content)
          .map((msg, index) => (
            <div
              key={index}
              className={`qwen-chat-message ${
                msg.role === 'user'
                  ? 'qwen-chat-message--user'
                  : 'qwen-chat-message--assistant'
              }`}
            >
              {msg.content}
            </div>
          ))}

        {/* Loading */}
        {isLoading && (
          <div className="qwen-chat-loading">🤖 Pensando...</div>
        )}
      </div>

      {/* FORMULARIO */}
      <div className="qwen-chat-form-wrapper">
        <form onSubmit={handleSend} className="qwen-chat-form">
          <input
            id="chat-input"
            name="message"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje aquí..."
            autoComplete="off"
            disabled={isLoading}
            className="qwen-chat-input"
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="qwen-chat-button"
          >
            {isLoading ? '...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
}