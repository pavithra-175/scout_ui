"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search, Phone, Video, MoreVertical, Paperclip, Smile, Send,
  MessageCircle, X, Image, FileText, Film, Music, File,
  BellOff, Bell, Trash2, Archive, UserMinus, Pin,
  ShieldOff, CheckCheck,
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
  attachment?: { name: string; type: string; url?: string };
}

interface Contact {
  id: string;
  name: string;
  initials: string;
  lastMessage: string;
  time: string;
  online: boolean;
  unread?: number;
  messages: Message[];
  muted?: boolean;
  pinned?: boolean;
}

const EMOJI_CATEGORIES: { label: string; emojis: string[] }[] = [
  { label: "Smileys", emojis: ["😀","😂","🥹","😊","😍","🤩","😎","🥳","😜","😅","😭","😤","🤔","😴","🤯","🥺","😇","🫠","😬","🙃"] },
  { label: "Gestures", emojis: ["👍","👎","👏","🙌","🤝","🫶","❤️","🔥","✨","💯","🎉","🎊","💪","🤙","👋","✌️","🤞","🫡","💀","🫶"] },
  { label: "Objects", emojis: ["💻","📱","🎮","📷","🎵","🍕","☕","🚀","🌍","⚡","🎯","🏆","💡","📚","🎨","🛠️","🔮","💎","🦄","🌈"] },
];

const FILE_TYPES = [
  { label: "Photo", icon: Image, accept: "image/*", color: "text-blue-400" },
  { label: "Video", icon: Film, accept: "video/*", color: "text-purple-400" },
  { label: "Audio", icon: Music, accept: "audio/*", color: "text-green-400" },
  { label: "Document", icon: FileText, accept: ".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx", color: "text-yellow-400" },
  { label: "Any File", icon: File, accept: "*", color: "text-pink-400" },
];

const initialContacts: Contact[] = [
  {
    id: "c1", name: "Sarah Chen", initials: "SC",
    lastMessage: "That sounds great! Let's discuss the project details tomorrow.",
    time: "10:48 AM", online: true,
    messages: [
      { id: "m1", text: "Hey! I saw your post about looking for team members for the hackathon.", sender: "them", time: "10:30 AM" },
      { id: "m2", text: "Hi Sarah! Yes, we're looking for someone with React and TypeScript experience. Are you interested?", sender: "me", time: "10:32 AM" },
      { id: "m3", text: "Absolutely! I've been working with React for 3 years and TypeScript for about 2. I'd love to join the team.", sender: "them", time: "10:35 AM" },
      { id: "m4", text: "That's perfect! We're building an AI accessibility tool. The hackathon is next weekend. Can you share some of your recent projects?", sender: "me", time: "10:38 AM" },
      { id: "m5", text: "Sure! Here's my portfolio: sarah-chen.dev. I've also contributed to a few open source accessibility libraries.", sender: "them", time: "10:42 AM" },
      { id: "m6", text: "Wow, your work looks amazing! I especially liked the voice-controlled navigation project.", sender: "me", time: "10:45 AM" },
      { id: "m7", text: "That sounds great! Let's discuss the project details tomorrow.", sender: "them", time: "10:48 AM" },
    ],
  },
  {
    id: "c2", name: "Alex Rivera", initials: "AR", lastMessage: "Thanks for the mentorship session!", time: "Yesterday", online: true,
    messages: [
      { id: "m1", text: "Hey, do you have time for a quick call about the project architecture?", sender: "them", time: "Yesterday" },
      { id: "m2", text: "Sure! Let's hop on at 5pm?", sender: "me", time: "Yesterday" },
      { id: "m3", text: "Thanks for the mentorship session!", sender: "them", time: "Yesterday" },
    ],
  },
  {
    id: "c3", name: "Emma Wilson", initials: "EW", lastMessage: "I'd love to collaborate on that Vue project!", time: "Sunday", online: false,
    messages: [
      { id: "m1", text: "Hey! I saw your profile and loved your Vue.js projects.", sender: "them", time: "Sunday" },
      { id: "m2", text: "Thanks Emma! I've been building with Vue for about a year now.", sender: "me", time: "Sunday" },
      { id: "m3", text: "I'd love to collaborate on that Vue project!", sender: "them", time: "Sunday" },
    ],
  },
  {
    id: "c4", name: "Jordan Lee", initials: "JL", lastMessage: "Let me know when you're free to review the PR.", time: "Monday", online: false,
    messages: [
      { id: "m1", text: "Hey, I pushed a fix for the auth bug.", sender: "them", time: "Monday" },
      { id: "m2", text: "Nice, I'll take a look shortly!", sender: "me", time: "Monday" },
      { id: "m3", text: "Let me know when you're free to review the PR.", sender: "them", time: "Monday" },
    ],
  },
  {
    id: "c5", name: "Priya Nair", initials: "PN", lastMessage: "The design mockups are ready for review.", time: "Tuesday", online: true, unread: 2,
    messages: [
      { id: "m1", text: "Just finished the new onboarding flow designs!", sender: "them", time: "Tuesday" },
      { id: "m2", text: "That was fast! Can't wait to see them.", sender: "me", time: "Tuesday" },
      { id: "m3", text: "The design mockups are ready for review.", sender: "them", time: "Tuesday" },
    ],
  },
];

function ConfirmModal({ title, desc, confirmLabel, confirmClass, onConfirm, onCancel }: {
  title: string; desc: string; confirmLabel: string; confirmClass: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-[#1C1C2A] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="text-xs text-white/40 mt-1.5 leading-relaxed">{desc}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${confirmClass}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, danger = false, active = false, onClick }: {
  icon: React.ReactNode; label: string; danger?: boolean; active?: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
        danger ? "text-red-400/80 hover:bg-red-500/10 hover:text-red-400"
        : active ? "text-highlightcolor hover:bg-highlightcolor/10"
        : "text-white/70 hover:bg-white/[0.05] hover:text-white"
      }`}>
      <span className={danger ? "text-red-400/70" : active ? "text-highlightcolor" : "text-white/40"}>{icon}</span>
      {label}
    </button>
  );
}

function MenuLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-4 pt-3 pb-1"><span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">{children}</span></div>;
}

function MenuDivider() {
  return <div className="border-t border-white/[0.07] mx-3 my-1" />;
}

export default function MessagesPage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [emojiTab, setEmojiTab] = useState(0);
  const [confirmModal, setConfirmModal] = useState<null | "clear" | "delete" | "block">(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingAccept, setPendingAccept] = useState("*");
  const emojiRef = useRef<HTMLDivElement>(null);
  const attachRef = useRef<HTMLDivElement>(null);
  const chatMenuRef = useRef<HTMLDivElement>(null);

  const activeContact = contacts.find((c) => c.id === activeId) ?? null;
  const filtered = [...contacts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeContact?.messages.length]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) setShowEmoji(false);
      if (attachRef.current && !attachRef.current.contains(e.target as Node)) setShowAttach(false);
      if (chatMenuRef.current && !chatMenuRef.current.contains(e.target as Node)) setShowChatMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const updateContact = (id: string, updates: Partial<Contact>) =>
    setContacts((prev) => prev.map((c) => c.id === id ? { ...c, ...updates } : c));

  const sendMessage = (text?: string, attachment?: Message["attachment"]) => {
    const t = (text ?? input).trim();
    if (!t && !attachment) return;
    if (!activeId) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg: Message = { id: `m${Date.now()}`, text: t, sender: "me", time, attachment };
    setContacts((prev) => prev.map((c) => c.id === activeId ? { ...c, messages: [...c.messages, newMsg], lastMessage: attachment ? `📎 ${attachment.name}` : t, time } : c));
    if (!text) setInput("");
    setTimeout(() => {
      const replies = ["That's interesting, tell me more!", "Got it, I'll look into that.", "Sounds good to me!", "Let me check and get back to you.", "Great idea! Let's do it.", "Sure, I'm on it!"];
      const reply: Message = { id: `m${Date.now() + 1}`, text: replies[Math.floor(Math.random() * replies.length)], sender: "them", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
      setContacts((prev) => prev.map((c) => c.id === activeId ? { ...c, messages: [...c.messages, reply], lastMessage: reply.text, time: reply.time } : c));
    }, 1200);
  };

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const addEmoji = (emoji: string) => setInput((prev) => prev + emoji);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : file.type.startsWith("audio/") ? "audio" : "file";
    sendMessage("", { name: file.name, type, url }); setShowAttach(false); e.target.value = "";
  };
  const openFilePicker = (accept: string) => { setPendingAccept(accept); setShowAttach(false); setTimeout(() => fileInputRef.current?.click(), 50); };

  // Chat menu actions
  const close = () => setShowChatMenu(false);
  const handleMuteToggle = () => { if (activeId) updateContact(activeId, { muted: !activeContact?.muted }); close(); };
  const handlePinToggle = () => { if (activeId) updateContact(activeId, { pinned: !activeContact?.pinned }); close(); };
  const handleMarkRead = () => { if (activeId) updateContact(activeId, { unread: undefined }); close(); };
  const handleArchive = () => { if (activeId) { updateContact(activeId, {}); setActiveId(null); } close(); };
  const handleClearChat = () => {
    if (activeId) setContacts((prev) => prev.map((c) => c.id === activeId ? { ...c, messages: [], lastMessage: "Chat cleared", time: "" } : c));
    setConfirmModal(null);
  };
  const handleDeleteChat = () => {
    if (activeId) { setContacts((prev) => prev.filter((c) => c.id !== activeId)); setActiveId(null); }
    setConfirmModal(null);
  };
  const handleBlock = () => {
    if (activeId) { setContacts((prev) => prev.filter((c) => c.id !== activeId)); setActiveId(null); }
    setConfirmModal(null);
  };

  return (
    <div className="bg-bgcolor flex flex-col overflow-hidden relative" style={{ position: "fixed", inset: 0 }}>
      <div className="bg-blob w-96 h-96 bg-highlightcolor top-[-120px] left-[-120px] animate-float pointer-events-none" />
      <div className="bg-blob w-72 h-72 bg-blue-500 bottom-[-80px] right-[-80px] animate-float pointer-events-none" style={{ animationDelay: "4s" }} />
      <input ref={fileInputRef} type="file" accept={pendingAccept} className="hidden" onChange={handleFileChange} />

      {/* Top nav */}
      <div className="shrink-0 relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-white/[0.02] backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-highlightcolor/20 border border-highlightcolor/30 flex items-center justify-center">
            <MessageCircle size={16} className="text-highlightcolor" />
          </div>
          <span className="font-semibold text-white tracking-wide">Messages</span>
        </div>
        <button className="text-sm text-white/50 hover:text-highlightcolor transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">Back to Feed</button>
      </div>

      <div className="flex overflow-hidden relative z-10" style={{ flex: 1, minHeight: 0 }}>
        {/* LEFT SIDEBAR */}
        <div className="w-72 shrink-0 flex flex-col border-r border-white/[0.07] bg-white/[0.01]">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2">
              <Search size={14} className="text-white/30 shrink-0" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages..."
                className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {filtered.map((contact) => (
              <button key={contact.id} onClick={() => setActiveId(contact.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 text-left hover:bg-white/[0.04] ${activeId === contact.id ? "bg-white/[0.06] border-r-2 border-highlightcolor" : ""}`}>
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-semibold text-highlightcolor">{contact.initials}</div>
                  {contact.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-bgcolor" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {contact.pinned && <Pin size={10} className="text-highlightcolor/70 shrink-0" />}
                      <span className="text-sm font-medium text-white truncate">{contact.name}</span>
                      {contact.muted && <BellOff size={10} className="text-white/30 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-white/30 shrink-0 ml-2">{contact.time}</span>
                  </div>
                  <p className="text-xs text-white/40 truncate mt-0.5">{contact.lastMessage}</p>
                </div>
                {contact.unread && (
                  <div className="shrink-0 w-5 h-5 rounded-full bg-highlightcolor flex items-center justify-center text-[10px] font-bold text-[#1C1C2A]">{contact.unread}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: CHAT OR EMPTY */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeContact ? (
            <>
              {/* Chat header */}
              <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-semibold text-highlightcolor">{activeContact.initials}</div>
                    {activeContact.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-bgcolor" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-white">{activeContact.name}</p>
                      {activeContact.pinned && <Pin size={11} className="text-highlightcolor/60" />}
                      {activeContact.muted && <BellOff size={11} className="text-white/30" />}
                    </div>
                    <p className="text-xs text-white/40">{activeContact.online ? "Online" : "Offline"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <IconBtn><Phone size={16} /></IconBtn>
                  <IconBtn><Video size={16} /></IconBtn>

                  {/* ⋯ Chat menu */}
                  <div className="relative" ref={chatMenuRef}>
                    <button
                      onClick={() => setShowChatMenu((v) => !v)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${showChatMenu ? "bg-highlightcolor/20 text-highlightcolor" : "text-white/40 hover:text-white hover:bg-white/[0.06]"}`}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {showChatMenu && (
                      <div className="absolute right-0 top-10 z-50 w-58 bg-[#1e1e2f] border border-white/[0.1] rounded-2xl overflow-hidden"
                        style={{ width: 224, boxShadow: "0 8px 40px rgba(0,0,0,0.55)" }}>

                        <MenuLabel>Conversation</MenuLabel>
                        <MenuItem icon={<Pin size={14} />} label={activeContact.pinned ? "Unpin chat" : "Pin to top"} active={activeContact.pinned} onClick={handlePinToggle} />
                        <MenuItem icon={activeContact.muted ? <Bell size={14} /> : <BellOff size={14} />} label={activeContact.muted ? "Unmute" : "Mute notifications"} active={activeContact.muted} onClick={handleMuteToggle} />
                        {(activeContact.unread ?? 0) > 0 && (
                          <MenuItem icon={<CheckCheck size={14} />} label="Mark as read" onClick={handleMarkRead} />
                        )}
                        <MenuItem icon={<Archive size={14} />} label="Archive chat" onClick={handleArchive} />

                        <MenuDivider />
                        <MenuLabel>Media</MenuLabel>
                        <MenuItem icon={<Image size={14} />} label="Shared photos & videos" onClick={close} />
                        <MenuItem icon={<FileText size={14} />} label="Shared documents" onClick={close} />

                        <MenuDivider />
                        <MenuLabel>Danger zone</MenuLabel>
                        <MenuItem icon={<Trash2 size={14} />} label="Clear messages" danger onClick={() => { close(); setConfirmModal("clear"); }} />
                        <MenuItem icon={<UserMinus size={14} />} label="Delete conversation" danger onClick={() => { close(); setConfirmModal("delete"); }} />
                        <MenuItem icon={<ShieldOff size={14} />} label="Block & report" danger onClick={() => { close(); setConfirmModal("block"); }} />
                        <div className="h-1.5" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Muted banner */}
              {activeContact.muted && (
                <div className="shrink-0 flex items-center justify-between px-5 py-2 bg-blue-500/10 border-b border-blue-500/20">
                  <div className="flex items-center gap-2 text-xs text-blue-300"><BellOff size={12} /> Notifications muted for this chat</div>
                  <button onClick={handleMuteToggle} className="text-xs text-blue-300/60 hover:text-blue-300 transition-colors">Unmute</button>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                {activeContact.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"><MessageCircle size={20} className="text-white/20" /></div>
                    <p className="text-sm text-white/30">No messages yet. Say hello!</p>
                  </div>
                ) : activeContact.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[65%] space-y-1">
                      {msg.attachment ? (
                        <div className={`px-4 py-3 rounded-2xl border ${msg.sender === "me" ? "bg-highlightcolor/20 border-highlightcolor/30 rounded-br-sm" : "bg-white/[0.07] border-white/[0.08] rounded-bl-sm"}`}>
                          {msg.attachment.type === "image" ? (
                            <div className="space-y-2"><img src={msg.attachment.url} alt={msg.attachment.name} className="max-w-full rounded-xl max-h-48 object-cover" /><p className="text-xs text-white/50">{msg.attachment.name}</p></div>
                          ) : msg.attachment.type === "video" ? (
                            <div className="space-y-2"><video src={msg.attachment.url} controls className="max-w-full rounded-xl max-h-40" /><p className="text-xs text-white/50">{msg.attachment.name}</p></div>
                          ) : msg.attachment.type === "audio" ? (
                            <div className="space-y-2"><audio src={msg.attachment.url} controls className="w-full" /><p className="text-xs text-white/50">{msg.attachment.name}</p></div>
                          ) : (
                            <a href={msg.attachment.url} download={msg.attachment.name} className="flex items-center gap-3 group">
                              <div className="w-9 h-9 rounded-xl bg-highlightcolor/20 border border-highlightcolor/30 flex items-center justify-center shrink-0"><FileText size={16} className="text-highlightcolor" /></div>
                              <div><p className="text-sm text-white group-hover:text-highlightcolor transition-colors">{msg.attachment.name}</p><p className="text-xs text-white/40">Tap to download</p></div>
                            </a>
                          )}
                          {msg.text && <p className="text-sm text-white/80 mt-1">{msg.text}</p>}
                        </div>
                      ) : (
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.sender === "me" ? "bg-highlightcolor/25 border border-highlightcolor/30 text-white rounded-br-sm" : "bg-white/[0.07] border border-white/[0.08] text-white/90 rounded-bl-sm"}`}>{msg.text}</div>
                      )}
                      <p className={`text-[10px] text-white/25 px-1 ${msg.sender === "me" ? "text-right" : "text-left"}`}>
                        {msg.time}{msg.sender === "me" && <span className="ml-1 text-highlightcolor/50">✓✓</span>}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="shrink-0 px-6 py-4 border-t border-white/[0.07] bg-white/[0.02] relative">
                {showEmoji && (
                  <div ref={emojiRef} className="absolute bottom-[72px] right-6 w-80 bg-[#1e1e2f] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-50" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}>
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
                      <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">Emoji</span>
                      <button onClick={() => setShowEmoji(false)} className="text-white/30 hover:text-white transition-colors"><X size={14} /></button>
                    </div>
                    <div className="flex border-b border-white/[0.07]">
                      {EMOJI_CATEGORIES.map((cat, i) => (
                        <button key={i} onClick={() => setEmojiTab(i)} className={`flex-1 py-2 text-xs font-medium transition-colors ${emojiTab === i ? "text-highlightcolor border-b-2 border-highlightcolor" : "text-white/40 hover:text-white/70"}`}>{cat.label}</button>
                      ))}
                    </div>
                    <div className="grid grid-cols-10 gap-0.5 p-3 max-h-44 overflow-y-auto">
                      {EMOJI_CATEGORIES[emojiTab].emojis.map((emoji) => (
                        <button key={emoji} onClick={() => addEmoji(emoji)} className="w-7 h-7 flex items-center justify-center text-lg hover:bg-white/[0.08] rounded-lg transition-colors">{emoji}</button>
                      ))}
                    </div>
                  </div>
                )}

                {showAttach && (
                  <div ref={attachRef} className="absolute bottom-[72px] left-6 w-56 bg-[#1e1e2f] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-50" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}>
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
                      <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">Attach</span>
                      <button onClick={() => setShowAttach(false)} className="text-white/30 hover:text-white transition-colors"><X size={14} /></button>
                    </div>
                    <div className="py-1.5">
                      {FILE_TYPES.map(({ label, icon: Icon, accept, color }) => (
                        <button key={label} onClick={() => openFilePicker(accept)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.05] transition-colors text-left">
                          <div className={`w-7 h-7 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center ${color}`}><Icon size={14} /></div>
                          <span className="text-sm text-white/70">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 bg-white/[0.05] border border-white/[0.09] rounded-2xl px-4 py-3">
                  <button onClick={() => { setShowAttach((v) => !v); setShowEmoji(false); }} className={`transition-colors shrink-0 ${showAttach ? "text-highlightcolor" : "text-white/30 hover:text-highlightcolor"}`}><Paperclip size={18} /></button>
                  <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Type a message..." className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none" />
                  <button onClick={() => { setShowEmoji((v) => !v); setShowAttach(false); }} className={`transition-colors shrink-0 ${showEmoji ? "text-highlightcolor" : "text-white/30 hover:text-highlightcolor"}`}><Smile size={18} /></button>
                  <button onClick={() => sendMessage()} disabled={!input.trim()} className="shrink-0 w-8 h-8 rounded-xl bg-highlightcolor/20 border border-highlightcolor/40 text-highlightcolor flex items-center justify-center hover:bg-highlightcolor/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><Send size={15} /></button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-8">
              <div className="w-20 h-20 rounded-full bg-highlightcolor/10 border border-highlightcolor/20 flex items-center justify-center"><MessageCircle size={32} className="text-highlightcolor/60" /></div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold text-white">Start a Conversation</h3>
                <p className="text-sm text-white/40 max-w-xs leading-relaxed">Select someone from the left to open a chat, or start a new conversation.</p>
              </div>
              <div className="flex gap-2 mt-2">
                {initialContacts.slice(0, 3).map((c) => (
                  <button key={c.id} onClick={() => setActiveId(c.id)} className="flex flex-col items-center gap-1.5 px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl hover:border-highlightcolor/40 hover:bg-white/[0.07] transition-all group">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-highlightcolor group-hover:bg-highlightcolor/20 transition-colors">{c.initials}</div>
                    <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">{c.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {confirmModal === "clear" && <ConfirmModal title="Clear all messages?" desc="All messages in this conversation will be permanently deleted. This cannot be undone." confirmLabel="Clear messages" confirmClass="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30" onConfirm={handleClearChat} onCancel={() => setConfirmModal(null)} />}
      {confirmModal === "delete" && <ConfirmModal title="Delete conversation?" desc="This chat will be removed from your messages list. This action is permanent." confirmLabel="Delete" confirmClass="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30" onConfirm={handleDeleteChat} onCancel={() => setConfirmModal(null)} />}
      {confirmModal === "block" && <ConfirmModal title={`Block ${activeContact?.name}?`} desc={`${activeContact?.name} won't be able to send you messages. You can manage blocked users in settings.`} confirmLabel="Block" confirmClass="bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30" onConfirm={handleBlock} onCancel={() => setConfirmModal(null)} />}
    </div>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return <button className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-all">{children}</button>;
}
