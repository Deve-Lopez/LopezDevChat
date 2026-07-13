import React, { useState } from 'react';
import './ChatApp.css';

const SUGGESTED_PROMPTS = [
  "Explícame qué hace este código",
  "Ayúdame a depurar un error de CORS",
  "Genera un componente React con hooks",
];

export default function ChatApp({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
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
      setMessages((prev) => [...prev, data.message]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '❌ Error: No se pudo obtener respuesta de Qwen. Revisa la terminal de Ollama.' }
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
          <span className="qwen-chat-status">API activa en localhost:11434 - Daniel López</span>
        </div>
      </div>

      <div className="qwen-chat-window">
        {messages.length === 0 && (
          <div className="qwen-chat-empty">
            <p className="qwen-chat-empty__title">¿En qué estás trabajando?</p>
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

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`qwen-chat-message ${msg.role === 'user' ? 'qwen-chat-message--user' : 'qwen-chat-message--assistant'}`}
          >
            {msg.content}
          </div>
        ))}

        {isLoading && (
          <div className="qwen-chat-loading">Pensando...</div>
        )}
      </div>

      <div className="qwen-chat-form-wrapper">
        <form onSubmit={handleSend} className="qwen-chat-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje aquí..."
            disabled={isLoading}
            className="qwen-chat-input"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="qwen-chat-button"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}