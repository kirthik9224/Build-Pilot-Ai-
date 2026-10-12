// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: Omnipresent Floating AI Copilot with prompt starters, streaming effects & actions

import { useState, useRef, useEffect } from 'react';
import { api } from '../api.js';

const PROMPT_STARTERS = [
  { label: '🛡️ Scan security flaws', text: 'Scan this project for OWASP Top 10 security vulnerabilities and hardcoded secrets.' },
  { label: '⚡ Fix all open bugs', text: 'What are the most critical open defects in this project and what is the exact patch to fix them?' },
  { label: '🎨 Design React hero', text: 'Create a modern dark-mode responsive hero banner with call to action buttons in React.' },
  { label: '⏱️ Delivery risk audit', text: 'Analyze our delivery risk and recommend priority tasks for our next milestone.' },
  { label: '📡 Check API health', text: 'Check the health status and latency of our backend microservices.' },
];

export default function AiCopilotWidget({ projectId, go }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'ASSISTANT',
      content: "👋 Hello! I am your **BuildPilot AI Copilot** (Gemini & ChatGPT-style developer assistant).\n\nAsk me anything about your project, scan code, generate UI, or execute one-click fixes!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef(null);

  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your current browser.');
      return;
    }
    if (listening) {
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendPrompt = async (textToSend) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || loading) return;

    const userMsg = {
      id: 'usr_' + Date.now(),
      role: 'USER',
      content: promptText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage({
        projectId: projectId || 1,
        message: promptText,
        contextFile: 'ProjectWorkspace',
      });

      const replyContent = res?.assistantMessage?.content ||
        'Processed your request successfully. Check the active module for details.';

      const botId = 'bot_' + Date.now();
      const botMsg = {
        id: botId,
        role: 'ASSISTANT',
        content: '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);

      // Conversational token streaming typewriter effect
      let currentIdx = 0;
      const interval = setInterval(() => {
        currentIdx += 4;
        if (currentIdx >= replyContent.length) {
          setMessages((prev) =>
            prev.map((m) => (m.id === botId ? { ...m, content: replyContent } : m))
          );
          clearInterval(interval);
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botId
                ? { ...m, content: replyContent.substring(0, currentIdx) }
                : m
            )
          );
        }
      }, 15);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          role: 'ASSISTANT',
          content: '⚠️ Unable to process query: ' + err.message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        className="copilot-fab"
        onClick={() => setIsOpen(!isOpen)}
        title="Open BuildPilot AI Copilot (ChatGPT/Gemini style)"
      >
        <span className="copilot-fab-sparkle">✨</span>
        <span className="copilot-fab-label">{isOpen ? 'Close' : 'Ask AI'}</span>
        <span className="copilot-fab-badge">PRO</span>
      </button>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="copilot-window glass">
          <header className="copilot-header">
            <div className="copilot-title">
              <span className="copilot-avatar">✨</span>
              <div>
                <b>BuildPilot Copilot</b>
                <span className="copilot-status">Online · GPT/Gemini Core</span>
              </div>
            </div>
            <div className="copilot-controls">
              <button className="copilot-ctrl-btn" onClick={() => setMessages([messages[0]])} title="Reset">
                ↺
              </button>
              <button className="copilot-ctrl-btn" onClick={() => setIsOpen(false)} title="Minimize">
                ✕
              </button>
            </div>
          </header>

          {/* Quick Action Chips */}
          <div className="copilot-starters">
            {PROMPT_STARTERS.map((s) => (
              <button
                key={s.label}
                className="starter-chip"
                onClick={() => sendPrompt(s.text)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="copilot-body" ref={scrollRef}>
            {messages.map((m) => (
              <div key={m.id} className={`copilot-bubble ${m.role.toLowerCase()}`}>
                <div className="bubble-header">
                  <span>{m.role === 'USER' ? 'You' : '✨ BuildPilot AI'}</span>
                  <small>{m.time}</small>
                </div>
                <div className="bubble-text">
                  {m.content.split('\n').map((line, i) => (
                    <p key={i} style={{ margin: '0.2rem 0' }}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="copilot-bubble assistant">
                <div className="typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            className="copilot-footer"
            onSubmit={(e) => {
              e.preventDefault();
              sendPrompt();
            }}
          >
            <input
              type="text"
              placeholder="Ask AI, e.g. 'Review this code' or 'Fix SQL bug'…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              className="chip"
              onClick={toggleVoice}
              title={listening ? 'Listening to voice…' : 'Dictate with voice'}
              style={{
                fontSize: '1rem',
                padding: '6px 10px',
                background: listening ? 'var(--crit)' : 'rgba(255,255,255,0.08)',
                color: '#fff',
                borderColor: listening ? 'transparent' : 'var(--line)',
              }}
            >
              {listening ? '🔴' : '🎙️'}
            </button>
            <button className="btn primary" disabled={loading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
