import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Send, X, MessageSquare, Bot, User, Sparkles } from 'lucide-react';

export const ChatDrawer: React.FC = () => {
  const {
    t,
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    addChatMessage,
    activeProjectCode,
    systemSettings,
  } = useApp();

  const [inputMsg, setInputMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeMessages = chatMessages.filter(
    (m) => m.projectCode.toLowerCase() === activeProjectCode.toLowerCase()
  );

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  if (!systemSettings.allowClientDirectChat && !isChatOpen) {
    return null;
  }

  if (!isChatOpen) {
    return (
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-[#14171f] hover:bg-[#1c202a] border border-white/[0.14] text-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all hover:scale-102 cursor-pointer flex items-center gap-2.5"
        title="Proje Sohbeti"
      >
        <MessageSquare className="w-4 h-4 text-white" />
        <span className="text-xs font-semibold">Proje Sohbeti</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
      </button>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    addChatMessage(activeProjectCode, inputMsg.trim(), 'client', 'Müşteri');
    setInputMsg('');
  };

  const handleQuickChip = (text: string) => {
    addChatMessage(activeProjectCode, text, 'client', 'Müşteri');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full sm:w-96 max-w-[calc(100vw-2rem)] bg-[#0a0b0e] border border-white/[0.12] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col h-[520px]">
      {/* Header */}
      <div className="p-4 bg-[#050506] border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center">
              SK
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border-2 border-[#050506]"></span>
          </div>
          <div>
            <div className="text-xs font-bold text-white leading-tight">
              {t.chat.leadEngineer}
            </div>
            <div className="text-[11px] text-[#8a8f98] font-mono">
              Proje: {activeProjectCode}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsChatOpen(false)}
          className="text-[#8a8f98] hover:text-white p-1 rounded-md hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#050506]/60 text-xs">
        {activeMessages.length === 0 ? (
          <div className="text-center py-8 text-[#62666d]">
            Henüz mesaj yok. Teknik ekibe projenizle ilgili soru sorabilirsiniz.
          </div>
        ) : (
          activeMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'client' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[10px] text-[#8a8f98]">
                {msg.sender === 'client' ? (
                  <>
                    <span>{msg.timestamp}</span>
                    <User className="w-3 h-3 text-[#8a8f98]" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-white" />
                    <span className="font-semibold text-white">{msg.senderName}</span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </>
                )}
              </div>

              <div
                className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'client'
                    ? 'bg-white text-black font-medium rounded-br-xs'
                    : 'bg-[#0a0b0e] border border-white/[0.08] text-[#f7f8f8] rounded-bl-xs'
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Inquiry Chips */}
      <div className="p-2 bg-[#050506] border-t border-white/[0.08] flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <button
          type="button"
          onClick={() => handleQuickChip(t.chat.quickQuery1)}
          className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#8a8f98] hover:text-white hover:border-white/[0.18] cursor-pointer transition-colors"
        >
          <Sparkles className="w-3 h-3 inline mr-1 text-white" />
          {t.chat.quickQuery1}
        </button>
        <button
          type="button"
          onClick={() => handleQuickChip(t.chat.quickQuery2)}
          className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#8a8f98] hover:text-white hover:border-white/[0.18] cursor-pointer transition-colors"
        >
          {t.chat.quickQuery2}
        </button>
      </div>

      {/* Input Box */}
      {systemSettings.allowClientDirectChat ? (
        <form onSubmit={handleSend} className="p-3 bg-[#050506] border-t border-white/[0.08] flex gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder={t.chat.inputPlaceholder}
            className="flex-1 bg-[#0a0b0e] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-white/[0.25]"
          />
          <button
            type="submit"
            className="p-2 btn-linear-primary rounded-xl cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 text-black" />
          </button>
        </form>
      ) : (
        <div className="p-3 bg-[#050506] border-t border-white/[0.08] text-[11px] text-[#8a8f98] text-center">
          Canlı sohbet yönetici ayarları gereği devre dışı bırakılmıştır.
        </div>
      )}
    </div>
  );
};
