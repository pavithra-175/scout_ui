'use client';

import React, { useState, useRef } from 'react';
import { Users, Share2, Trash2, Check, X, Plus, MessageSquare, Video, Calendar, ListTodo, Settings, UserPlus, Search, Smile, Paperclip, Image, Send, Minus, Edit2, ChevronDown, Github, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

// ==================== THEME ====================
// bg: #1C1C2A  highlight: #C4AAF1  surface: #232333  card: rgba(255,255,255,0.04)

const H = '#C4AAF1'; // highlight
const BG = '#1C1C2A';
const SURF = '#232333';
const CARD = 'rgba(255,255,255,0.04)';

// ==================== TYPES ====================
interface TeamMember { id: string; name: string; initials: string; color: string; role: string; skills: string[]; leader?: boolean; }
interface PendingInvitation { id: string; name: string; email: string; initials: string; color: string; role: string; skills: string[]; status: 'pending'; teamId: string; daysAgo: number; }
interface JoinRequest { id: string; name: string; role: string; location: string; skills: string[]; initials: string; color: string; teamId: string; gitActivity?: string; }
interface Task { id: string; title: string; status: 'Done' | 'In Progress' | 'To Do'; teamId: string; }
interface ChatMessage { id: string; sender: string; text: string; time: string; isMine: boolean; type: 'text' | 'image' | 'file'; }
interface Team { id: string; name: string; description: string; tags: string[]; members: TeamMember[]; maxMembers: number; inviteLink: string; isPublic: boolean; createdAt: string; ownerId: string; image?: string | null; }

const TAG_SUGGESTIONS = ['AI', 'ML', 'React', 'Next.js', 'Python', 'Node.js', 'Blockchain', 'Mobile', 'GreenTech', 'SaaS', 'Web3', 'TypeScript', 'DevOps', 'Design', 'DataScience', 'HealthTech', 'EdTech', 'Fintech'];
const SUGGESTED_PEOPLE = [
  { id: 'p1', name: 'Raj Kumar', initials: 'RK', color: 'bg-orange-500/20 text-orange-300', gender: 'Male', role: 'ML Engineer', skills: ['Python', 'TensorFlow', 'AI'], gitActivity: '47 commits/mo', location: 'Bangalore', bio: '4 yrs building production AI. Open-source contributor.', experience: 'Expert', availability: 'Full-time', keywords: ['AI/ML', 'Data Science', 'deep learning'] },
  { id: 'p2', name: 'Ananya S.', initials: 'AS', color: 'bg-pink-500/20 text-pink-300', gender: 'Female', role: 'React Developer', skills: ['React', 'TypeScript', 'SaaS'], gitActivity: '62 commits/mo', location: 'Mumbai', bio: 'Frontend specialist. Design systems expert.', experience: 'Intermediate', availability: 'Part-time', keywords: ['Web Development', 'UI/UX'] },
  { id: 'p3', name: 'Dev Patel', initials: 'DP', color: 'bg-blue-500/20 text-blue-300', gender: 'Male', role: 'Full-stack', skills: ['Node.js', 'React', 'ML'], gitActivity: '38 commits/mo', location: 'Pune', bio: 'Bridging frontend and ML. Clean APIs.', experience: 'Intermediate', availability: 'Weekends only', keywords: ['Backend', 'Fullstack', 'AI'] },
  { id: 'p4', name: 'Sara Chen', initials: 'SC', color: 'bg-green-500/20 text-green-300', gender: 'Female', role: 'Data Scientist', skills: ['Python', 'DataScience', 'AI'], gitActivity: '29 commits/mo', location: 'Hyderabad', bio: 'NLP & CV researcher. PhD candidate at IIT.', experience: 'Expert', availability: 'Full-time', keywords: ['NLP', 'Computer Vision', 'Research'] },
  { id: 'p5', name: 'Marco R.', initials: 'MR', color: 'bg-purple-500/20 text-purple-300', gender: 'Male', role: 'DevOps', skills: ['DevOps', 'Node.js', 'TypeScript'], gitActivity: '55 commits/mo', location: 'Chennai', bio: 'Zero-downtime deployments. IaC evangelist.', experience: 'Expert', availability: 'Contract', keywords: ['Cloud', 'AWS', 'Kubernetes', 'Docker'] },
];

// ==================== MAIN PAGE ====================
export default function TeamPage() {
  const ME_ID = 'me';

  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1', name: 'AI Startup Project', description: 'Building an AI-powered content creation platform', tags: ['AI', 'ML', 'SaaS'],
      members: [
        { id: ME_ID, name: 'You', initials: 'ME', color: 'bg-[#C4AAF1]/20 text-[#C4AAF1]', role: 'Lead Developer', skills: ['React', 'TypeScript'], leader: true },
        { id: '2', name: 'Sarah C.', initials: 'SC', color: 'bg-teal-500/20 text-teal-300', role: 'ML Engineer', skills: ['Python', 'PyTorch'] },
        { id: '3', name: 'Mike P.', initials: 'MP', color: 'bg-yellow-500/20 text-yellow-300', role: 'Designer', skills: ['Figma', 'UI/UX'] }
      ],
      maxMembers: 5, inviteLink: 'https://scout.app/invite/ai-startup', isPublic: true, createdAt: '2024-01-15', ownerId: ME_ID
    },
    {
      id: '2', name: 'Hackathon Team Alpha', description: 'Developing a sustainable energy tracking app', tags: ['GreenTech', 'Mobile'],
      members: [
        { id: '4', name: 'Alex R.', initials: 'AR', color: 'bg-green-500/20 text-green-300', role: 'Project Manager', skills: ['Agile'], leader: true },
        { id: '5', name: 'Elena K.', initials: 'EK', color: 'bg-blue-500/20 text-blue-300', role: 'Fullstack', skills: ['Next.js'] },
        { id: ME_ID, name: 'You', initials: 'ME', color: 'bg-[#C4AAF1]/20 text-[#C4AAF1]', role: 'Frontend Dev', skills: ['React'] }
      ],
      maxMembers: 4, inviteLink: 'https://scout.app/invite/alpha', isPublic: false, createdAt: '2024-02-10', ownerId: '4'
    }
  ]);

  const [selectedTeamId, setSelectedTeamId] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'chat' | 'meetings' | 'requests'>('overview');
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showShareFeedModal, setShowShareFeedModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddPeopleModal, setShowAddPeopleModal] = useState(false);
  const [justInvited, setJustInvited] = useState<string | null>(null);

  const [newTeamData, setNewTeamData] = useState({ name: '', description: '', tags: [] as string[], maxMembers: 5, isPublic: true, image: null as string | null });
  const [tagInput, setTagInput] = useState('');

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Design system setup', status: 'Done', teamId: '1' },
    { id: '2', title: 'API architecture', status: 'In Progress', teamId: '1' },
    { id: '3', title: 'ML model training', status: 'In Progress', teamId: '1' },
    { id: '4', title: 'Frontend scaffolding', status: 'To Do', teamId: '1' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([
    { id: 'i1', name: 'Emma Wilson', email: 'emma@example.com', initials: 'EW', color: 'bg-pink-500/20 text-pink-300', role: 'UI/UX Designer', skills: ['Figma', 'Design'], status: 'pending', teamId: '1', daysAgo: 3 },
    { id: 'i2', name: 'Michael Brown', email: 'michael@example.com', initials: 'MB', color: 'bg-blue-500/20 text-blue-300', role: 'Backend Dev', skills: ['Node.js', 'Go'], status: 'pending', teamId: '1', daysAgo: 9 },
  ]);

  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([
    { id: 'r1', name: 'Lisa Johnson', role: 'Full-stack Developer', location: 'New York', skills: ['React', 'Node.js', 'AI'], initials: 'LJ', color: 'bg-purple-500/20 text-purple-300', teamId: '1', gitActivity: '41 commits/mo' }
  ]);

  React.useEffect(() => {
    const stored = localStorage.getItem('scout_join_requests');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.length > 0) setJoinRequests(parsed);
    }
  }, []);

  const safeSetJoinRequests = (fn: (prev: JoinRequest[]) => JoinRequest[]) => {
    setJoinRequests((prev: JoinRequest[]) => {
      const next = fn(prev);
      localStorage.setItem('scout_join_requests', JSON.stringify(next));
      return next;
    });
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'm1', sender: 'John D.', text: 'Frontend scaffolding is 80% done!', time: '10:32 AM', isMine: false, type: 'text' },
    { id: 'm2', sender: 'You', text: "Excellent. Let's sync tomorrow.", time: '10:35 AM', isMine: true, type: 'text' },
    { id: 'm3', sender: 'Sarah C.', text: 'ML model hitting 94% accuracy 🚀', time: '10:40 AM', isMine: false, type: 'text' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const [searchPeople, setSearchPeople] = useState('');
  
  /* ── Add People filters ── */
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [fLocation,  setFLocation]  = useState('');
  const [fGender,    setFGender]    = useState<string[]>([]);
  const [fRole,      setFRole]      = useState<string[]>([]);
  const [fSkills,    setFSkills]    = useState<string[]>([]);
  const [fExp,       setFExp]       = useState<string[]>([]);
  const [fAvail,     setFAvail]     = useState<string[]>([]);
  const [fGithub,    setFGithub]    = useState<string[]>([]);
  const [skillSearch,setSkillSearch]= useState('');

  interface Chip { key: string; label: string; value: string; }
  const activeChips: Chip[] = [
    ...(fLocation ? [{ key:'loc', label:`📍 ${fLocation}`, value:fLocation }] : []),
    ...fGender.map(g  => ({ key:'gender', label:g,         value:g })),
    ...fRole.map(r    => ({ key:'role',   label:r,         value:r })),
    ...fSkills.map(s  => ({ key:'skill',  label:s,         value:s })),
    ...fExp.map(e     => ({ key:'exp',    label:e,         value:e })),
    ...fAvail.map(a   => ({ key:'avail',  label:a,         value:a })),
    ...fGithub.map(g  => ({ key:'gh',     label:`⚡ ${g}`,  value:g })),
  ];

  const removeChip = (c: Chip) => {
    if (c.key==='loc')    setFLocation('');
    if (c.key==='gender') setFGender(p => p.filter(v=>v!==c.value));
    if (c.key==='role')   setFRole(p   => p.filter(v=>v!==c.value));
    if (c.key==='skill')  setFSkills(p => p.filter(v=>v!==c.value));
    if (c.key==='exp')    setFExp(p    => p.filter(v=>v!==c.value));
    if (c.key==='avail')  setFAvail(p  => p.filter(v=>v!==c.value));
    if (c.key==='gh')     setFGithub(p => p.filter(v=>v!==c.value));
  };

  const clearAllFilters = () => {
    setFLocation('');setFGender([]);setFRole([]);setFSkills([]);
    setFExp([]);setFAvail([]);setFGithub([]);setSearchPeople('');
  };

  const tog = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(v=>v!==val) : [...arr, val];

  const SKILL_OPTIONS = ['React','TypeScript','Python','Node.js','AI','ML','Figma','Solidity','Go','Rust','Flutter','Docker','Kubernetes','PostgreSQL','MongoDB','GraphQL','TensorFlow','PyTorch','Next.js','AWS','DataScience','SQL','CSS','Web3'];
  const parseCommits = (s: string) => parseInt(s) || 0;

  const [editTeam, setEditTeam] = useState<Team | null>(null);

  const selectedTeam = teams.find(t => t.id === selectedTeamId) || teams[0];
  const isOwner = selectedTeam.ownerId === ME_ID;

  // ---- Handlers ----
  const removeInvite = (id: string) => setPendingInvitations(prev => prev.filter(i => i.id !== id));

  const acceptRequest = (req: JoinRequest) => {
    const newMember: TeamMember = { id: req.id, name: req.name, initials: req.initials, color: req.color, role: req.role, skills: req.skills };
    setTeams(prev => prev.map(t => t.id === selectedTeamId ? { ...t, members: [...t.members, newMember] } : t));
    safeSetJoinRequests(prev => prev.filter(r => r.id !== req.id));
  };
  const declineRequest = (id: string) => safeSetJoinRequests(prev => prev.filter(r => r.id !== id));

  const [confirmRemoveMember, setConfirmRemoveMember] = useState<TeamMember | null>(null);
  const [selectedMemberProfile, setSelectedMemberProfile] = useState<TeamMember | null>(null);

  const removeMember = (memberId: string) => {
    setTeams(prev => prev.map(t => t.id === selectedTeamId ? { ...t, members: t.members.filter(m => m.id !== memberId) } : t));
    setConfirmRemoveMember(null);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { id: String(Date.now()), sender: 'You', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isMine: true, type: 'text' }]);
    setChatInput('');
  };

  const handleCreateTeam = () => {
    if (!newTeamData.name || !newTeamData.description) return;
    const t: Team = {
      id: String(Date.now()), ...newTeamData,
      members: [{ id: ME_ID, name: 'You', initials: 'ME', color: 'bg-[#C4AAF1]/20 text-[#C4AAF1]', role: 'Owner', skills: [] }],
      inviteLink: `https://scout.app/invite/${Math.random().toString(36).substr(2, 8)}`,
      createdAt: new Date().toISOString().split('T')[0], ownerId: ME_ID
    };
    setTeams(prev => [...prev, t]);
    setSelectedTeamId(t.id);
    setShowCreateTeam(false);
    setNewTeamData({ name: '', description: '', tags: [], maxMembers: 5, isPublic: true, image: null });
    if (t.isPublic) setShowShareFeedModal(true);
  };

  const handleAddTag = (tag: string) => {
    const t = tag.trim();
    if (t && !newTeamData.tags.includes(t)) setNewTeamData(p => ({ ...p, tags: [...p.tags, t] }));
    setTagInput('');
  };

  const saveTeamSettings = () => {
    if (!editTeam) return;
    setTeams(prev => prev.map(t => t.id === editTeam.id ? editTeam : t));
    setShowSettingsModal(false);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks(prev => [...prev, { id: String(Date.now()), title: newTaskTitle.trim(), status: 'To Do', teamId: selectedTeamId }]);
    setNewTaskTitle('');
  };

  const filteredPeople = SUGGESTED_PEOPLE.filter(p => {
    if (selectedTeam.members.find(m => m.id === p.id)) return false;
    
    const pData = [
      p.name, p.role, p.location, p.bio, p.experience, p.availability, 
      ...p.skills, ...(p.keywords || [])
    ].map(x => (x || '').toLowerCase());
    
    const q = searchPeople.toLowerCase().trim();
    const searchMatch = !q || pData.some(val => val.includes(q));
    if (!searchMatch) return false;

    // Active Hard Filters
    if (fLocation && !p.location.toLowerCase().includes(fLocation.toLowerCase())) return false;
    if (fGender.length > 0 && !fGender.includes(p.gender)) return false;
    if (fRole.length > 0 && !fRole.some(r => p.role.toLowerCase().includes(r.toLowerCase()))) return false;
    if (fExp.length > 0 && !fExp.includes(p.experience)) return false;
    if (fAvail.length > 0 && !fAvail.includes(p.availability)) return false;
    if (fSkills.length > 0 && !fSkills.every(s => p.skills.includes(s))) return false;
    if (fGithub.includes('30+ commits/mo') && parseCommits(p.gitActivity) < 30) return false;
    if (fGithub.includes('60+ commits/mo') && parseCommits(p.gitActivity) < 60) return false;

    const teamTags = selectedTeam.tags.map(t => t.toLowerCase().trim()).filter(Boolean);
    const tagMatch = teamTags.length === 0 || teamTags.some(tag => 
      pData.some(val => val.includes(tag) || tag.includes(val))
    );
    
    return tagMatch;
  }).sort((a, b) => {
    const getScore = (p: typeof SUGGESTED_PEOPLE[0]) => {
      const teamTags = selectedTeam.tags.map(t => t.toLowerCase().trim()).filter(Boolean);
      const pData = [p.name, p.role, p.location, p.bio, p.experience, p.availability, ...p.skills, ...(p.keywords || [])].map(x => (x || '').toLowerCase());
      let score = 0;
      teamTags.forEach(tag => {
        if (pData.some(val => val.includes(tag) || tag.includes(val))) score++;
      });
      return score;
    };
    return getScore(b) - getScore(a);
  });

  const emojis = ['😀', '🚀', '🔥', '👍', '💡', '✅', '🎯', '💪', '🤝', '🎉'];

  const inp = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C4AAF1] transition-all placeholder-gray-600';
  const btn = 'bg-[#C4AAF1] hover:bg-[#d4bef8] text-[#1C1C2A] font-bold rounded-xl transition-all';

  return (
    <div className="min-h-screen text-white font-sans p-4 lg:p-8" style={{ backgroundColor: BG }}>
      {/* Toast Notification */}
      {justInvited && (
        <div className="fixed bottom-6 right-6 z-[80] flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-[#C4AAF1]/30 shadow-2xl" style={{ backgroundColor: SURF }}>
          <div className="w-7 h-7 rounded-full bg-[#C4AAF1]/20 border border-[#C4AAF1]/30 flex items-center justify-center">
            <Check size={14} className="text-[#C4AAF1]" />
          </div>
          <span className="text-sm font-bold">Request sent to {justInvited}</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Your Teams</h1>
            <p className="text-gray-500 text-sm">Manage and collaborate with your teams.</p>
          </div>
          <button onClick={() => setShowCreateTeam(true)} className={`${btn} py-2.5 px-5 flex items-center gap-2 text-sm`}>
            <Plus size={16} /> Create Team
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-3">
            {teams.map(team => (
              <div key={team.id} onClick={() => { setSelectedTeamId(team.id); setActiveTab('overview'); }}
                className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${selectedTeamId === team.id ? 'border-[#C4AAF1] bg-[#C4AAF1]/5' : 'border-transparent hover:border-white/10'}`}
                style={{ backgroundColor: selectedTeamId === team.id ? undefined : SURF }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: 'rgba(196,170,241,0.1)' }}>
                    {team.image ? <img src={team.image} alt="" className="w-full h-full object-cover"/> : <Users size={20} className="text-[#C4AAF1]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{team.name}</h3>
                    <p className="text-gray-500 text-xs">{team.members.length}/{team.maxMembers} members</p>
                  </div>
                </div>
                {/* Owner badge + Tags in sidebar */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {team.ownerId === ME_ID && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 flex items-center gap-0.5">★ Owner</span>
                  )}
                  {team.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-bold text-[#C4AAF1] bg-[#C4AAF1]/10 border border-[#C4AAF1]/20">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Main Panel */}
          <div className="lg:col-span-3 rounded-3xl border border-white/5 overflow-hidden" style={{ backgroundColor: SURF }}>

            {/* Team Header */}
            <div className="p-6 border-b border-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedTeam.name}</h2>
                  <p className="text-gray-400 text-sm mb-2">{selectedTeam.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTeam.tags.map(tag => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-full font-bold text-[#C4AAF1] bg-[#C4AAF1]/10 border border-[#C4AAF1]/20">{tag}</span>
                    ))}
                  </div>
                </div>
                {isOwner && (
                  <div className="flex gap-2">
                    <button onClick={() => { setShowAddPeopleModal(true); }} className="p-2.5 rounded-xl text-gray-400 hover:text-[#C4AAF1] hover:bg-[#C4AAF1]/10 transition-all" title="Add People">
                      <UserPlus size={20} />
                    </button>
                    <button onClick={() => { setEditTeam({ ...selectedTeam }); setShowSettingsModal(true); }} className="p-2.5 rounded-xl text-gray-400 hover:text-[#C4AAF1] hover:bg-[#C4AAF1]/10 transition-all" title="Team Settings">
                      <Settings size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 pt-4 pb-0 border-b border-white/5 overflow-x-auto">
              {(['overview', 'tasks', 'chat', 'meetings', 'requests'] as const).map(tab => {
                if (tab === 'requests' && !isOwner) return null;
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2.5 rounded-t-xl text-sm font-bold capitalize transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white/5 text-[#C4AAF1] border-b-2 border-[#C4AAF1]' : 'text-gray-500 hover:text-gray-300'}`}>
                    {tab === 'requests' ? 'Join Requests' : tab}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="p-6">

              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left */}
                  <div className="space-y-8">
                    {/* Members */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold flex items-center gap-2"><Users size={18} className="text-[#C4AAF1]" /> Members ({selectedTeam.members.length}/{selectedTeam.maxMembers})</h4>
                      </div>
                      <div className="space-y-2">
                        {selectedTeam.members.map(member => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-3 rounded-xl border border-white/5 hover:bg-white/5 hover:border-[#C4AAF1]/20 transition-all cursor-pointer"
                            style={{ backgroundColor: CARD }}
                            onClick={() => setSelectedMemberProfile(member)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${member.color}`}>{member.initials}</div>
                              <div>
                                <p className="font-bold text-sm">{member.name}{member.leader && <span className="ml-2 text-[10px] text-[#C4AAF1] bg-[#C4AAF1]/10 px-1.5 py-0.5 rounded-full">Owner</span>}</p>
                                <p className="text-gray-500 text-xs">{member.role}</p>
                              </div>
                            </div>
                            {isOwner && member.id !== ME_ID && (
                              <button onClick={e => { e.stopPropagation(); setConfirmRemoveMember(member); }} className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Remove member"><X size={14} /></button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pending Invitations - only for owner */}
                    {isOwner && (
                      <div>
                        <h4 className="font-bold text-sm mb-3 text-gray-300">Pending Invitations</h4>
                        <div className="space-y-2">
                          {pendingInvitations.filter(i => i.teamId === selectedTeamId).length === 0
                            ? <p className="text-gray-600 text-xs">No pending invitations.</p>
                            : pendingInvitations.filter(i => i.teamId === selectedTeamId).map(inv => (
                              <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5" style={{ backgroundColor: CARD }}>
                                <Link href={`/profile/${inv.id}`} className="flex items-center gap-3 group transition-all">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${inv.color}`}>{inv.initials}</div>
                                  <div>
                                    <p className="font-bold text-sm group-hover:text-[#C4AAF1] transition-colors">{inv.name}</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">{inv.role}</span>
                                      {inv.skills.slice(0, 2).map(skill => (
                                        <span key={skill} className="text-[10px] px-1.5 py-0.5 rounded bg-[#C4AAF1]/10 text-[#C4AAF1]">#{skill}</span>
                                      ))}
                                    </div>
                                  </div>
                                </Link>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${inv.daysAgo > 7 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                    {inv.daysAgo === 0 ? 'Just now' : `${inv.daysAgo}d ago`}
                                  </span>
                                  <button onClick={() => removeInvite(inv.id)} className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Cancel invite">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right */}
                  <div className="space-y-8">
                    {/* Quick Actions */}
                    <div>
                      <h4 className="font-bold text-sm mb-3 text-gray-300">Quick Actions</h4>
                      <div className="space-y-2">
                        <button onClick={() => setActiveTab('chat')} className="w-full flex items-center justify-between p-3 rounded-xl border border-white/5 hover:border-[#C4AAF1]/30 hover:bg-white/5 transition-all">
                          <div className="flex items-center gap-3"><MessageSquare size={18} className="text-[#C4AAF1]" /><span className="font-bold text-sm">Open Team Chat</span></div>
                          <span className="bg-[#C4AAF1] text-[#1C1C2A] text-xs font-black px-2 py-0.5 rounded-full">3</span>
                        </button>
                        <button onClick={() => setActiveTab('meetings')} className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-[#C4AAF1]/30 hover:bg-white/5 transition-all">
                          <Video size={18} className="text-[#C4AAF1]" /><span className="font-bold text-sm">Start Video Call</span>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-[#C4AAF1]/30 hover:bg-white/5 transition-all">
                          <Calendar size={18} className="text-[#C4AAF1]" /><span className="font-bold text-sm">Schedule Meeting</span>
                        </button>
                        <button onClick={() => setActiveTab('tasks')} className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-[#C4AAF1]/30 hover:bg-white/5 transition-all">
                          <ListTodo size={18} className="text-[#C4AAF1]" /><span className="font-bold text-sm">View All Tasks</span>
                        </button>
                      </div>
                    </div>

                    {/* Member view - if not owner, show team info */}
                    {!isOwner && (
                      <div className="p-4 rounded-xl border border-[#C4AAF1]/20 bg-[#C4AAF1]/5">
                        <p className="text-[#C4AAF1] text-sm font-bold mb-1">You are a member</p>
                        <p className="text-gray-400 text-xs">Created by the team owner. Use the Quick Actions above to collaborate with your team.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TASKS */}
              {activeTab === 'tasks' && (
                <div className="max-w-xl space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-lg">Project Tasks</h4>
                    <span className="text-gray-500 text-xs font-mono">{tasks.filter(t => t.teamId === selectedTeamId).length} tasks</span>
                  </div>
                  <div className="space-y-2">
                    {tasks.filter(t => t.teamId === selectedTeamId).map(task => (
                      <div key={task.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-[#C4AAF1]/20 transition-all" style={{ backgroundColor: CARD }}>
                        <div className="flex items-center gap-3">
                          <button onClick={() => {
                            const s: Task['status'][] = ['To Do', 'In Progress', 'Done'];
                            const next = s[(s.indexOf(task.status) + 1) % 3];
                            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: next } : t));
                          }} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${task.status === 'Done' ? 'bg-[#C4AAF1] border-[#C4AAF1]' : 'border-gray-600 hover:border-[#C4AAF1]'}`}>
                            {task.status === 'Done' && <Check size={12} className="text-[#1C1C2A]" />}
                          </button>
                          <span className={`font-semibold text-sm ${task.status === 'Done' ? 'line-through text-gray-600' : ''}`}>{task.title}</span>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${task.status === 'Done' ? 'bg-green-500/10 text-green-400' : task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-500'}`}>
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-white/5">
                    <input type="text" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Add a task..." className={inp} onKeyPress={e => e.key === 'Enter' && handleAddTask()} />
                    <button onClick={handleAddTask} className={`${btn} px-5 text-sm`}>Add</button>
                  </div>
                </div>
              )}

              {/* CHAT */}
              {activeTab === 'chat' && (
                <div className="h-[520px] flex flex-col rounded-2xl border border-white/5 overflow-hidden" style={{ backgroundColor: BG }}>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#C4AAF1]/20 flex items-center justify-center text-[#C4AAF1] font-black text-sm">{selectedTeam.name[0]}</div>
                    <div>
                      <p className="font-bold text-sm">{selectedTeam.name}</p>
                      <p className="text-gray-500 text-xs">{selectedTeam.members.length} members</p>
                    </div>
                  </div>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] ${msg.isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                          {!msg.isMine && <p className="text-[#C4AAF1] text-xs font-bold px-2">{msg.sender}</p>}
                          <div className={`px-4 py-2.5 rounded-2xl text-sm ${msg.isMine ? 'bg-[#C4AAF1] text-[#1C1C2A] rounded-tr-none font-medium' : 'bg-white/5 text-white border border-white/5 rounded-tl-none'}`}>
                            {msg.type === 'file' ? <span className="flex items-center gap-2"><Paperclip size={14} />{msg.text}</span>
                              : msg.type === 'image' ? <span className="flex items-center gap-2"><Image size={14} />{msg.text}</span>
                                : msg.text}
                          </div>
                          <p className="text-gray-600 text-[10px] px-2">{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Emoji Picker */}
                  {showEmoji && (
                    <div className="px-4 py-2 border-t border-white/5 flex gap-2 flex-wrap">
                      {emojis.map(e => <button key={e} onClick={() => { setChatInput(p => p + e); setShowEmoji(false); }} className="text-xl hover:scale-125 transition-all">{e}</button>)}
                    </div>
                  )}
                  {/* Input Bar */}
                  <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setShowEmoji(p => !p)} className="p-2 text-gray-500 hover:text-[#C4AAF1] transition-all rounded-lg hover:bg-[#C4AAF1]/10"><Smile size={20} /></button>
                      <input type="file" ref={fileInputRef} className="hidden" onChange={e => { if (e.target.files?.[0]) { setMessages(p => [...p, { id: String(Date.now()), sender: 'You', text: e.target.files![0].name, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isMine: true, type: 'file' }]); } }} />
                      <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-[#C4AAF1] transition-all rounded-lg hover:bg-[#C4AAF1]/10"><Paperclip size={20} /></button>
                      <input type="file" ref={imgInputRef} accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) { setMessages(p => [...p, { id: String(Date.now()), sender: 'You', text: e.target.files![0].name, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isMine: true, type: 'image' }]); } }} />
                      <button onClick={() => imgInputRef.current?.click()} className="p-2 text-gray-500 hover:text-[#C4AAF1] transition-all rounded-lg hover:bg-[#C4AAF1]/10"><Image size={20} /></button>
                      <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className={`flex-1 ${inp}`} />
                      <button onClick={sendMessage} className={`${btn} p-2.5`}><Send size={18} /></button>
                    </div>
                  </div>
                </div>
              )}

              {/* MEETINGS */}
              {activeTab === 'meetings' && (
                <div className="h-[440px] rounded-2xl border border-white/5 flex flex-col items-center justify-center space-y-6 relative overflow-hidden" style={{ backgroundColor: BG }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C4AAF1]/5 to-transparent" />
                  <div className="w-28 h-28 rounded-full border border-[#C4AAF1]/20 bg-[#C4AAF1]/10 flex items-center justify-center animate-pulse relative">
                    <Video className="text-[#C4AAF1]" size={44} />
                  </div>
                  <div className="text-center relative">
                    <h4 className="text-2xl font-bold mb-2">Start a Room</h4>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">Collaborate face-to-face with your team instantly.</p>
                  </div>
                  <button className={`${btn} py-3 px-10 text-lg shadow-[0_0_25px_rgba(196,170,241,0.2)] relative`}>Start Video Call</button>
                </div>
              )}

              {/* JOIN REQUESTS (Owner only) */}
              {activeTab === 'requests' && isOwner && (
                <div className="max-w-2xl space-y-6">
                  <div>
                    <h4 className="text-xl font-bold mb-1">Join Requests</h4>
                    <p className="text-gray-500 text-sm">People who want to join your team</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {joinRequests.filter(r => r.teamId === selectedTeamId).length === 0
                      ? <div className="col-span-full py-12 text-center bg-white/2 rounded-3xl border border-dashed border-white/10">
                        <Users size={40} className="mx-auto text-gray-700 mb-3" />
                        <p className="text-gray-500 text-sm">No pending requests at the moment.</p>
                      </div>
                      : joinRequests.filter(r => r.teamId === selectedTeamId).map(req => (
                        <div key={req.id} className="p-5 rounded-2xl border border-white/5" style={{ backgroundColor: CARD }}>
                          <Link href={`/profile/${req.id}`} className="flex items-center gap-3 mb-4 group transition-all">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${req.color}`}>{req.initials}</div>
                            <div>
                              <p className="font-bold text-base group-hover:text-[#C4AAF1] transition-colors">{req.name}</p>
                              <p className="text-gray-500 text-xs">{req.role}</p>
                              <p className="text-gray-500 text-xs">{req.location}</p>
                            </div>
                          </Link>
                          {req.gitActivity && (
                            <div className="mb-4 p-2 rounded-lg bg-white/5 border border-white/5">
                              <p className="text-[#C4AAF1] text-xs font-mono flex items-center gap-2">
                                <Github size={12} /> {req.gitActivity}
                              </p>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1.5 mb-5">
                            {req.skills.map(s => (
                              <span key={s} className="text-[10px] px-2 py-1 rounded-md bg-white/5 text-gray-400 border border-white/5 font-bold uppercase tracking-wider">{s}</span>
                            ))}
                          </div>
                          <div className="flex gap-2 pt-2 border-t border-white/5">
                            <button onClick={() => declineRequest(req.id)} className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-white/10 text-gray-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all">Decline</button>
                            <button onClick={() => acceptRequest(req)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${btn}`}>Accept</button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ============ CREATE TEAM MODAL ============ */}
      {showCreateTeam && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 p-8 my-auto" style={{ backgroundColor: SURF }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">Create Team</h2>
              <button onClick={() => setShowCreateTeam(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
            </div>
            <div className="space-y-5">
              {/* Image Picker */}
              <div className="flex justify-center mb-2">
                <div className="relative group cursor-pointer" onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file'; input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setNewTeamData(p => ({ ...p, image: reader.result as string }));
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}>
                  <div className={`w-24 h-24 rounded-3xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${newTeamData.image ? 'border-[#C4AAF1]/50' : 'border-white/10 hover:border-[#C4AAF1]/30 hover:bg-white/5'}`}>
                    {newTeamData.image ? (
                      <img src={newTeamData.image} alt="Team" className="w-full h-full object-cover" />
                    ) : (
                      <Image size={28} className="text-gray-500 group-hover:text-[#C4AAF1] transition-colors" />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-[#C4AAF1] text-[#1C1C2A] flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <Edit2 size={14} />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 block">Team Name</label>
                <input type="text" value={newTeamData.name} onChange={e => setNewTeamData(p => ({ ...p, name: e.target.value }))} placeholder="Enter team name..." className={inp} />
              </div>
              <div>
                <label className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 block">Description</label>
                <textarea value={newTeamData.description} onChange={e => setNewTeamData(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Describe your team goals..." className={`${inp} resize-none`} />
              </div>
              {/* Tags */}
              <div>
                <label className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {TAG_SUGGESTIONS.filter(t => !newTeamData.tags.includes(t)).slice(0, 8).map(t => (
                    <button key={t} onClick={() => handleAddTag(t)} className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-gray-400 hover:border-[#C4AAF1] hover:text-[#C4AAF1] hover:bg-[#C4AAF1]/5 transition-all">{t}</button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Custom tag..." className={inp} onKeyPress={e => { if (e.key === 'Enter') handleAddTag(tagInput); }} />
                  <button onClick={() => handleAddTag(tagInput)} className={`${btn} px-4 text-sm`}><Plus size={16} /></button>
                </div>
                {newTeamData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {newTeamData.tags.map(t => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-[#C4AAF1]/10 text-[#C4AAF1] border border-[#C4AAF1]/20 flex items-center gap-1">
                        {t}<button onClick={() => setNewTeamData(p => ({ ...p, tags: p.tags.filter(x => x !== t) }))}><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {/* Member Count */}
              <div>
                <label className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 block">Max Members</label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setNewTeamData(p => ({ ...p, maxMembers: Math.max(2, p.maxMembers - 1) }))} className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 hover:border-[#C4AAF1] hover:text-[#C4AAF1] transition-all"><Minus size={16} /></button>
                  <span className="text-2xl font-black w-12 text-center">{newTeamData.maxMembers}</span>
                  <button onClick={() => setNewTeamData(p => ({ ...p, maxMembers: Math.min(20, p.maxMembers + 1) }))} className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 hover:border-[#C4AAF1] hover:text-[#C4AAF1] transition-all"><Plus size={16} /></button>
                </div>
              </div>
              {/* Visibility */}
              <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/2">
                <div><p className="font-bold text-sm">Public Team</p><p className="text-gray-500 text-xs">Allow others to find and request to join</p></div>
                <button onClick={() => setNewTeamData(p => ({ ...p, isPublic: !p.isPublic }))} className={`w-12 h-6 rounded-full relative transition-all ${newTeamData.isPublic ? 'bg-[#C4AAF1]' : 'bg-gray-700'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${newTeamData.isPublic ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
              <button onClick={handleCreateTeam} className={`w-full ${btn} py-4 text-base`}>Create Team</button>
            </div>
          </div>
        </div>
      )}

      {/* ============ SETTINGS MODAL (Owner only) ============ */}
      {showSettingsModal && editTeam && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 p-8 my-auto" style={{ backgroundColor: SURF }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">Team Settings</h2>
              <button onClick={() => setShowSettingsModal(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
            </div>
            <div className="space-y-5">
              {/* Image Picker */}
              <div className="flex justify-center mb-2">
                <div className="relative group cursor-pointer" onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file'; input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setEditTeam({ ...editTeam, image: reader.result as string });
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}>
                  <div className={`w-24 h-24 rounded-3xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${editTeam.image ? 'border-[#C4AAF1]/50' : 'border-white/10 hover:border-[#C4AAF1]/30 hover:bg-white/5'}`}>
                    {editTeam.image ? (
                      <img src={editTeam.image} alt="Team" className="w-full h-full object-cover" />
                    ) : (
                      <Image size={28} className="text-gray-500 group-hover:text-[#C4AAF1] transition-colors" />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-[#C4AAF1] text-[#1C1C2A] flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <Edit2 size={14} />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 block">Team Name</label>
                <input type="text" value={editTeam.name} onChange={e => setEditTeam({ ...editTeam, name: e.target.value })} className={inp} />
              </div>
              <div>
                <label className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 block">Description</label>
                <textarea value={editTeam.description} onChange={e => setEditTeam({ ...editTeam, description: e.target.value })} rows={3} className={`${inp} resize-none`} />
              </div>
              {/* Tags */}
              <div>
                <label className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {TAG_SUGGESTIONS.filter(t => !editTeam.tags.includes(t)).slice(0, 8).map(t => (
                    <button key={t} onClick={() => setEditTeam({ ...editTeam, tags: [...editTeam.tags, t] })} className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-gray-400 hover:border-[#C4AAF1] hover:text-[#C4AAF1] hover:bg-[#C4AAF1]/5 transition-all">{t}</button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Custom tag..." className={inp} onKeyPress={e => { if (e.key === 'Enter') { const t = tagInput.trim(); if (t && !editTeam.tags.includes(t)) setEditTeam({ ...editTeam, tags: [...editTeam.tags, t] }); setTagInput(''); } }} />
                  <button onClick={() => { const t = tagInput.trim(); if (t && !editTeam.tags.includes(t)) setEditTeam({ ...editTeam, tags: [...editTeam.tags, t] }); setTagInput(''); }} className={`${btn} px-4 text-sm`}><Plus size={16} /></button>
                </div>
                {editTeam.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {editTeam.tags.map(t => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-[#C4AAF1]/10 text-[#C4AAF1] border border-[#C4AAF1]/20 flex items-center gap-1">
                        {t}<button onClick={() => setEditTeam({ ...editTeam, tags: editTeam.tags.filter(x => x !== t) })}><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 block">Max Members</label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setEditTeam({ ...editTeam, maxMembers: Math.max(editTeam.members.length, editTeam.maxMembers - 1) })} className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 hover:border-[#C4AAF1] hover:text-[#C4AAF1] transition-all"><Minus size={16} /></button>
                  <span className="text-2xl font-black w-12 text-center">{editTeam.maxMembers}</span>
                  <button onClick={() => setEditTeam({ ...editTeam, maxMembers: Math.min(50, editTeam.maxMembers + 1) })} className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 hover:border-[#C4AAF1] hover:text-[#C4AAF1] transition-all"><Plus size={16} /></button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/2">
                <div><p className="font-bold text-sm">Public Team</p><p className="text-gray-500 text-xs">Allow others to find and request to join</p></div>
                <button onClick={() => setEditTeam({ ...editTeam, isPublic: !editTeam.isPublic })} className={`w-12 h-6 rounded-full relative transition-all ${editTeam.isPublic ? 'bg-[#C4AAF1]' : 'bg-gray-700'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editTeam.isPublic ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowSettingsModal(false)} className="flex-1 py-4 rounded-xl text-base font-bold text-gray-400 hover:bg-white/5 border border-white/10 transition-all">Cancel</button>
                <button onClick={saveTeamSettings} className={`flex-1 ${btn} py-4 text-base`}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ ADD PEOPLE MODAL ============ */}
      {showAddPeopleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-[#C4AAF1]/20 shadow-2xl shadow-[#C4AAF1]/5 flex flex-col max-h-[85vh]" style={{ backgroundColor: SURF }}>
            <div className="p-6 border-b border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black tracking-tight">Add People</h2>
                <button onClick={() => setShowAddPeopleModal(false)} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"><X size={18} /></button>
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" value={searchPeople} onChange={e => setSearchPeople(e.target.value)} placeholder="Search by name, bio, or role..." className="w-full h-12 rounded-2xl pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none transition-all focus:ring-1 focus:ring-[#C4AAF1]/40 bg-black/40 border border-white/10 shadow-inner" />
                </div>
                {/* Filter button */}
                <button onClick={()=>setShowFilterBar(p=>!p)}
                  className={`flex items-center gap-2 h-12 px-5 rounded-2xl border text-sm font-bold transition-all flex-shrink-0 ${showFilterBar||activeChips.length>0?'text-[#C4AAF1] bg-[#C4AAF1]/10 border-[#C4AAF1]/40':'text-gray-400 hover:text-white bg-black/40 hover:border-white/30 border-white/10'}`}>
                  <SlidersHorizontal size={16}/>
                  <span className="hidden sm:inline">Filters</span>
                  {activeChips.length>0&&<span className="min-w-[20px] h-[20px] rounded-full bg-[#C4AAF1] text-[#1C1C2A] text-[11px] font-black flex items-center justify-center px-1.5 ml-1">{activeChips.length}</span>}
                </button>
              </div>

              {/* Active Chips Row */}
              {activeChips.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {activeChips.map(c => (
                    <span key={c.key+c.value} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wide"
                      style={{ backgroundColor:'rgba(196,170,241,0.15)', color:'#C4AAF1', border:'1px solid rgba(196,170,241,0.3)' }}>
                      {c.label}
                      <button onClick={()=>removeChip(c)} className="hover:text-white transition-colors ml-1"><X size={12}/></button>
                    </span>
                  ))}
                  <button onClick={clearAllFilters} className="text-[11px] font-bold text-gray-500 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all">Clear All</button>
                </div>
              )}

              {/* Collapsible Filter Menu */}
              {showFilterBar && (
                <div className="mt-5 p-6 rounded-3xl border border-white/10 space-y-6 bg-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#C4AAF1]/5 blur-3xl rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                    {/* Location */}
                    <div>
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2.5">Location</p>
                      <input type="text" value={fLocation} onChange={e=>setFLocation(e.target.value)}
                        placeholder="e.g. Remote"
                        className="w-full h-10 rounded-xl px-3.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-all focus:ring-1 focus:ring-[#C4AAF1]/50 bg-black/40 border border-white/10" />
                    </div>

                    {/* Skills */}
                    <div>
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2.5">Skills Match</p>
                      <div className="relative">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"/>
                        <input type="text" value={skillSearch} onChange={e=>setSkillSearch(e.target.value)}
                          placeholder="Find skills…"
                          className="w-full h-10 rounded-xl pl-9 pr-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-all focus:ring-1 focus:ring-[#C4AAF1]/50 bg-black/40 border border-white/10" />
                      </div>
                      {skillSearch && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1" style={{ scrollbarWidth:'none' }}>
                          {SKILL_OPTIONS.filter(s=>!fSkills.includes(s)&&s.toLowerCase().includes(skillSearch.toLowerCase())).slice(0,8).map(s=>(
                            <button key={s} onClick={()=>{setFSkills(p=>[...p,s]);setSkillSearch('');}}
                              className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-gray-400 hover:text-[#1C1C2A] bg-black/20 hover:bg-[#C4AAF1] hover:border-[#C4AAF1] transition-all font-semibold">
                              + {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* GitHub */}
                    <div>
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2.5">GitHub Activity</p>
                      <div className="flex flex-col gap-2.5 pt-1">
                        {['30+ commits/mo','60+ commits/mo'].map(opt=>(
                          <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                            <div onClick={()=>setFGithub(p=>tog(p,opt))}
                              className={`w-5 h-5 rounded flex items-center justify-center border transition-all shadow-inner cursor-pointer ${fGithub.includes(opt)?'bg-[#C4AAF1] border-[#C4AAF1]':'bg-black/40 border-slate-600 group-hover:border-[#C4AAF1]/50'}`}>
                              {fGithub.includes(opt)&&<Check size={14} className="text-[#1C1C2A] font-black"/>}
                            </div>
                            <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-200 transition-colors">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2.5">Gender</p>
                      <div className="flex flex-col items-start gap-2">
                        {['Male','Female','Non-binary'].map(g=>(
                          <button key={g} onClick={()=>setFGender(p=>tog(p,g))}
                            className={`text-xs px-3.5 py-1.5 rounded-full border font-bold transition-all shadow-sm ${fGender.includes(g)?'bg-[#C4AAF1] border-[#C4AAF1] text-[#1C1C2A]':'bg-black/20 border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/5'}`}>{g}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 relative z-10" style={{ borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                    {/* Role */}
                    <div>
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2.5">Role Type</p>
                      <div className="flex flex-wrap gap-2">
                        {['Developer','Designer','DevOps','Data Scientist'].map(r=>(
                          <button key={r} onClick={()=>setFRole(p=>tog(p,r))}
                            className={`text-[11px] px-3.5 py-1.5 rounded-full border font-bold transition-all shadow-sm ${fRole.includes(r)?'bg-[#C4AAF1] border-[#C4AAF1] text-[#1C1C2A]':'bg-black/20 border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/5'}`}>{r}</button>
                        ))}
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2.5">Experience Level</p>
                      <div className="flex flex-wrap gap-2">
                        {['Beginner','Intermediate','Expert'].map(e=>(
                          <button key={e} onClick={()=>setFExp(p=>tog(p,e))}
                            className={`text-[11px] px-3.5 py-1.5 rounded-full border font-bold transition-all shadow-sm ${fExp.includes(e)?'bg-[#C4AAF1] border-[#C4AAF1] text-[#1C1C2A]':'bg-black/20 border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/5'}`}>{e}</button>
                        ))}
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2.5">Availability Profile</p>
                      <div className="flex flex-wrap gap-2">
                        {['Full-time','Part-time','Contract','Freelance','Weekends only'].map(a=>(
                          <button key={a} onClick={()=>setFAvail(p=>tog(p,a))}
                            className={`text-[11px] px-3.5 py-1.5 rounded-full border font-bold transition-all shadow-sm ${fAvail.includes(a)?'bg-[#C4AAF1] border-[#C4AAF1] text-[#1C1C2A]':'bg-black/20 border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/5'}`}>{a}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 relative bg-[#1C1C2A]/50">
              <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#1C1C2A] to-transparent pointer-events-none z-10"></div>
              {filteredPeople.length === 0
                ? <p className="text-gray-500 text-sm font-medium text-center py-12">No matching people found. Adjust your filters.</p>
                : filteredPeople.map(person => (
                  <div key={person.id} className="flex gap-4 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group" style={{ backgroundColor: CARD }}>
                    <Link href={`/profile/${person.id}`} className="shrink-0">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border border-white/5 group-hover:border-[#C4AAF1]/30 transition-all ${person.color}`}>{person.initials}</div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <Link href={`/profile/${person.id}`} className="group-hover/link">
                          <h3 className="font-bold text-base hover:text-[#C4AAF1] transition-colors">{person.name}</h3>
                          <p className="text-gray-400 text-xs mt-0.5">{person.role} • {person.location}</p>
                        </Link>
                        <button onClick={() => {
                          const alreadyPending = pendingInvitations.some(i => i.id === person.id && i.teamId === selectedTeamId);
                          if (alreadyPending) return;
                          const newInvite: PendingInvitation = {
                            id: person.id, name: person.name, email: `${person.name.split(' ')[0].toLowerCase()}@example.com`,
                            initials: person.initials, color: person.color, role: person.role, skills: person.skills,
                            status: 'pending', teamId: selectedTeamId, daysAgo: 0
                          };
                          setPendingInvitations(prev => [...prev, newInvite]);
                          setJustInvited(person.name);
                          setTimeout(() => setJustInvited(null), 3000);
                        }} className={`h-9 ${btn} text-xs px-4 flex items-center justify-center gap-2 shadow-sm font-black`}>
                          {pendingInvitations.some(i => i.id === person.id && i.teamId === selectedTeamId) ? (
                            <>Pending</>
                          ) : (
                            <><UserPlus size={14} /> Add</>
                          )}
                        </button>
                      </div>
                      
                      <p className="text-gray-300 text-sm mt-3 mb-4 line-clamp-2 leading-relaxed">{person.bio}</p>
                      
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-[10px] px-2.5 py-1 rounded bg-black/40 text-gray-300 font-bold border border-white/5 flex items-center gap-1.5 shadow-inner">
                          <Check size={10} className="text-emerald-400" /> {person.experience}
                        </span>
                        <span className="text-[10px] px-2.5 py-1 rounded bg-black/40 text-gray-300 font-bold border border-white/5 shadow-inner">
                          {person.availability}
                        </span>
                        <div className="w-px h-3 bg-white/10 mx-1.5"></div>
                        {person.skills.filter(s => selectedTeam.tags.some(t => s.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(s.toLowerCase()))).map(s => (
                          <span key={s} className="text-[10px] px-2.5 py-1 rounded bg-[#C4AAF1]/10 text-[#C4AAF1] border border-[#C4AAF1]/20 font-bold tracking-wide">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {/* ============ SHARE TO FEED ============ */}
      {showShareFeedModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4" onClick={()=>setShowShareFeedModal(false)}>
          <div className="w-full max-w-md rounded-3xl border border-[#C4AAF1]/30 p-8 text-center space-y-6" style={{ backgroundColor: SURF }} onClick={e=>e.stopPropagation()}>
            <div className="w-20 h-20 rounded-full bg-[#C4AAF1]/10 border border-[#C4AAF1]/20 flex items-center justify-center mx-auto">
              <Share2 className="text-[#C4AAF1]" size={36} />
            </div>
            <div>
              <h2 className="text-2xl font-black mb-2">Share to Feed?</h2>
              <p className="text-gray-400 text-sm">Your team is public! Share it to the global feed to attract the best collaborators based on your tags.</p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => {
                const posts = JSON.parse(localStorage.getItem('scout_posts') || '[]');
                const newlyCreatedTeam = teams.find(t=>t.id===selectedTeamId);
                if (newlyCreatedTeam) {
                  const newPost = {
                    id: String(Date.now()), authorId: ME_ID, content: newlyCreatedTeam.description,
                    tags: newlyCreatedTeam.tags, skillTags: [], likes: 0, liked: false, bookmarked: false,
                    time: 'Just now', shares: 0, showComments: false, comments: [],
                    type: 'team', teamId: selectedTeamId, teamData: newlyCreatedTeam
                  };
                  posts.unshift(newPost);
                  localStorage.setItem('scout_posts', JSON.stringify(posts));
                  setShowShareFeedModal(false);
                }
              }} className={`w-full ${btn} py-3.5 text-base shadow-[0_0_15px_rgba(196,170,241,0.2)]`}>Yes, Share to Feed</button>
              <button onClick={() => setShowShareFeedModal(false)} className="w-full py-3.5 rounded-xl text-gray-400 font-bold text-base border border-white/10 hover:bg-white/5 transition-all">Maybe later</button>
            </div>
          </div>
        </div>
      )}

      {/* ============ MEMBER PROFILE POPUP ============ */}
      {selectedMemberProfile && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setSelectedMemberProfile(null)}>
          <div className="w-full max-w-sm rounded-3xl border border-white/10 overflow-hidden" style={{ backgroundColor: SURF }} onClick={e => e.stopPropagation()}>
            {/* Header gradient */}
            <div className="h-24 relative" style={{ background: 'linear-gradient(135deg, rgba(196,170,241,0.15), rgba(196,170,241,0.03))' }}>
              <button onClick={() => setSelectedMemberProfile(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-all"><X size={20} /></button>
              {/* Avatar overlapping */}
              <div className={`absolute -bottom-8 left-6 w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl border-4 border-[#232333] ${selectedMemberProfile.color}`}>
                {selectedMemberProfile.initials}
              </div>
            </div>
            <div className="pt-12 px-6 pb-6">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="text-xl font-black">{selectedMemberProfile.name}</h3>
                  <p className="text-gray-400 text-sm">{selectedMemberProfile.role}</p>
                </div>
                {selectedMemberProfile.leader && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20">★ Owner</span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMemberProfile.skills.length > 0
                    ? selectedMemberProfile.skills.map(s => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-[#C4AAF1]/10 text-[#C4AAF1] border border-[#C4AAF1]/20 font-bold">{s}</span>
                    ))
                    : <span className="text-gray-600 text-xs">No skills listed</span>
                  }
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-gray-500 text-xs">Member of <span className="text-white font-bold">{selectedTeam.name}</span></p>
              </div>
              {isOwner && selectedMemberProfile.id !== ME_ID && (
                <button
                  onClick={() => { setConfirmRemoveMember(selectedMemberProfile); setSelectedMemberProfile(null); }}
                  className="w-full mt-4 py-2.5 rounded-xl text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                >
                  Remove from Team
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============ CONFIRM REMOVE MEMBER ============ */}
      {confirmRemoveMember && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 p-8 text-center space-y-6" style={{ backgroundColor: SURF }}>
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <Trash2 className="text-red-400" size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black mb-2">Remove Member?</h3>
              <p className="text-gray-400 text-sm">
                Are you sure you want to remove{' '}
                <span className="font-bold text-white">{confirmRemoveMember.name}</span>{' '}
                from <span className="font-bold text-white">{selectedTeam.name}</span>?
              </p>
              <p className="text-gray-600 text-xs mt-2">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmRemoveMember(null)} className="flex-1 py-3 rounded-xl text-sm font-bold border border-white/10 text-gray-400 hover:bg-white/5 transition-all">
                Cancel
              </button>
              <button onClick={() => removeMember(confirmRemoveMember.id)} className="flex-1 py-3 rounded-xl text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all">
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
