'use client';

import React, { useState, useEffect } from 'react';
import { Search, Hash, MoreVertical, Phone, Video, Info, Send, Image, Smile, Paperclip } from 'lucide-react';

const BG     = '#0d0d1a';
const SURF   = '#13132a';
const CARD   = '#1a1a30';
const BORDER = 'rgba(255,255,255,0.07)';
const HL     = '#C4AAF1';
const ME_ID  = 'me';

interface ChatMessage {
  id: string;
  targetId: string;
  senderId: string;
  type: 'text'|'post_share';
  postId?: string;
  text?: string;
  time: string;
}

const ALL_PEOPLE = [
  { id: 'p4', name: 'Sara Chen', initials: 'SC', color: 'bg-emerald-500/20 text-emerald-300', role: 'Data Scientist', location: 'Hyderabad' },
  { id: 'p1', name: 'Raj Kumar', initials: 'RK', color: 'bg-orange-500/20 text-orange-300', role: 'ML Engineer', location: 'Bangalore' },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeChat, setActiveChat] = useState('p4');
  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('scout_messages');
    if (stored) {
      setMessages(JSON.parse(stored));
    }
    const iv = setInterval(() => {
      const st = localStorage.getItem('scout_messages');
      if (st) setMessages(JSON.parse(st));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const sendMsg = () => {
    if (!inputVal.trim()) return;
    const nm = { id: String(Date.now()), targetId: activeChat, senderId: ME_ID, type: 'text' as const, text: inputVal, time: new Date().toISOString() };
    const next = [...messages, nm];
    setMessages(next);
    localStorage.setItem('scout_messages', JSON.stringify(next));
    setInputVal('');
  };

  const activeMessages = messages.filter(m => (m.senderId === ME_ID && m.targetId === activeChat) || (m.senderId === activeChat && m.targetId === ME_ID));
  const activePerson = ALL_PEOPLE.find(p => p.id === activeChat) || ALL_PEOPLE[0];

  return (
    <div className="h-screen flex text-white font-sans overflow-hidden" style={{ backgroundColor: BG }}>
      {/* Sidebar */}
      <div className="w-[320px] flex-shrink-0 flex flex-col border-r" style={{ borderColor: BORDER, backgroundColor: SURF }}>
        <div className="p-4 border-b" style={{ borderColor: BORDER }}>
          <h2 className="text-xl font-black tracking-tight mb-4">Messages</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Search messages..." className="w-full h-10 rounded-xl pl-9 pr-4 text-sm bg-black/40 text-white focus:outline-none transition-all focus:ring-1 focus:ring-[#C4AAF1]/30 border" style={{ borderColor: BORDER }} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {ALL_PEOPLE.map(p => (
            <button key={p.id} onClick={() => setActiveChat(p.id)} className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${activeChat === p.id ? 'bg-[#C4AAF1]/10' : 'hover:bg-white/[0.03]'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${p.color}`}>{p.initials}</div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-bold text-sm truncate">{p.name}</h4>
                  <span className="text-[10px] text-gray-500">2h</span>
                </div>
                <p className="text-xs text-gray-400 truncate">Tap to view messages</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-16 flex items-center justify-between px-6 border-b" style={{ borderColor: BORDER, backgroundColor: SURF }}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${activePerson.color}`}>{activePerson.initials}</div>
            <div>
              <h3 className="font-bold text-sm">{activePerson.name}</h3>
              <p className="text-xs text-emerald-400 font-medium">Online</p>
            </div>
          </div>
          <div className="flex gap-2">
            {[Phone, Video, Info].map((Icon, i) => (
              <button key={i} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"><Icon size={16} /></button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeMessages.map(m => {
            const isMe = m.senderId === ME_ID;
            return (
              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {m.type === 'text' && (
                    <div className={`px-4 py-3 rounded-2xl text-sm ${isMe ? 'bg-[#C4AAF1] text-[#0d0d1a] rounded-tr-sm font-medium' : 'bg-white/5 border border-white/10 rounded-tl-sm'}`}>
                      {m.text}
                    </div>
                  )}
                  {m.type === 'post_share' && (
                    <div className={`p-4 rounded-2xl text-sm w-80 ${isMe ? 'bg-[#C4AAF1]/10 border border-[#C4AAF1]/20 rounded-tr-sm' : 'bg-white/5 border border-white/10 rounded-tl-sm'}`}>
                      <p className="text-xs font-bold text-[#C4AAF1] mb-2">Forwarded Post</p>
                      <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                        <div className="font-bold text-sm mb-1">Shared a post with you</div>
                        <p className="text-xs text-gray-400 line-clamp-2">Check out this post from the global feed. Click to view details.</p>
                      </div>
                    </div>
                  )}
                  <p className="text-[10px] text-gray-500 px-1">{new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t" style={{ borderColor: BORDER, backgroundColor: SURF }}>
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <button className="p-2 text-gray-500 hover:text-[#C4AAF1] transition-all rounded-xl hover:bg-[#C4AAF1]/10"><Smile size={20} /></button>
            <button className="p-2 text-gray-500 hover:text-[#C4AAF1] transition-all rounded-xl hover:bg-[#C4AAF1]/10"><Paperclip size={20} /></button>
            <button className="p-2 text-gray-500 hover:text-[#C4AAF1] transition-all rounded-xl hover:bg-[#C4AAF1]/10"><Image size={20} /></button>
            <input type="text" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMsg()} placeholder="Message..." className="flex-1 h-12 rounded-xl px-4 bg-black/40 text-white border border-white/5 focus:outline-none transition-all focus:border-[#C4AAF1]/30" />
            <button onClick={sendMsg} className="h-12 px-5 rounded-xl font-bold bg-[#C4AAF1] text-[#0d0d1a] hover:brightness-110 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(196,170,241,0.2)]">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
