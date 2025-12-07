import React, { useState, useEffect, useRef } from 'react';
import { PaperClipIcon } from '@heroicons/react/24/outline';
import { Bot, User, Send, X, MessageSquare, Sparkles } from "lucide-react";
import { API_BASE_URL } from '../config';

const ChatWidget = ({ forceOpen = false }) => {
  const [open, setOpen] = useState(forceOpen);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am SkillBuddy AI. How can I help you learn today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, isTyping]);

  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  const handleSend = async () => {
    if (input.trim() === '') return;
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      setIsTyping(false);
      setMessages(msgs => [...msgs, { sender: 'ai', text: data.response || 'Sorry, I encountered an error.' }]);
    } catch (err) {
      setIsTyping(false);
      setMessages(msgs => [...msgs, { sender: 'ai', text: 'Error connecting to AI service.' }]);
    }
  };

  return (
    <>
      {!forceOpen && (
        <button
          className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 rounded-full shadow-2xl shadow-indigo-500/30 flex items-center justify-center text-white transition-all z-50 hover:scale-110 active:scale-95"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      )}

      {open && (
        <div className={forceOpen ? "w-full h-full flex flex-col bg-slate-900 rounded-2xl border border-slate-800" : "fixed bottom-24 right-6 w-96 h-[500px] bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 flex flex-col z-50 overflow-hidden animate-fade-in"}>
          
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">AI Mentor</h3>
              <p className="text-xs text-indigo-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Online
              </p>
            </div>
            {!forceOpen && (
                <button onClick={() => setOpen(false)} className="ml-auto text-slate-500 hover:text-white">
                    <X size={18} />
                </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-slate-700' : 'bg-indigo-600/20 text-indigo-400'}`}>
                  {msg.sender === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                </div>
                <div className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0"><Sparkles size={14} /></div>
                 <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-none border border-slate-700 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200"></span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-800 bg-slate-900">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about code..."
                className="flex-1 bg-slate-800 border-transparent focus:border-indigo-500 focus:ring-0 rounded-lg text-sm text-white placeholder-slate-500 px-4 py-2.5 transition-all"
              />
              <button 
                onClick={handleSend}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg p-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!input.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default ChatWidget;
