'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search, Heart, MessageCircle, Share2, UserPlus, Users, X, Check,
  Flame, TrendingUp, Bookmark, MoreHorizontal, Send, Plus, MapPin,
  GitBranch, Eye, Zap, Code, Cpu, Globe, Layers, Shield, Smartphone,
  Database, ImageIcon, Smile, SlidersHorizontal, Clock, Sparkles,
  Github, Star, GitFork, Activity, Copy, Hash, MessageSquare, Trash2,
} from 'lucide-react';

/* ═══════ THEME ═══════ */
const BG     = '#0d0d1a';
const SURF   = '#13132a';
const CARD   = '#1a1a30';
const BORDER = 'rgba(255,255,255,0.07)';
const HL     = '#C4AAF1';

/* ═══════ TYPES ═══════ */
interface GithubStats {
  username: string; repos: number; stars: number; followers: number;
  topLanguages: string[]; contributions: number; streak: number;
}
interface Person {
  id: string; name: string; initials: string; color: string; gender: string;
  role: string; skills: string[]; location: string; country: string;
  gitActivity: string; bio: string; availability: string; experience: string;
  domain: string[]; lookingFor: string[]; connections: number;
  roleType: 'student' | 'mentor'; github?: GithubStats;
}
interface Team { id: string; name: string; ownerId: string; members: string[]; maxMembers: number; tags: string[]; }
interface PostComment { id: string; authorId: string; text: string; time: string; }
interface Post {
  id: string; authorId: string; content: string; tags: string[];
  skillTags: string[]; likes: number; liked: boolean; bookmarked: boolean;
  time: string; comments: PostComment[]; shares: number;
  showComments: boolean; image?: string; type?: 'team' | 'regular'; teamId?: string; teamData?: Team;
}

/* ═══════ DATA ═══════ */
const ME_ID = 'me';

const ALL_PEOPLE: Person[] = [
  { id: ME_ID, name: 'Jordan Lee', initials: 'JL', color: 'bg-violet-500/20 text-violet-300', gender: 'Non-binary', role: 'Lead Developer', skills: ['React','TypeScript','Next.js','GraphQL'], location: 'Bangalore', country: 'India', gitActivity: '72 commits/mo', bio: 'Building collaborative dev tools. Open to hackathon teams.', availability: 'Part-time', experience: 'Expert', domain: ['Web Development','AI/ML'], lookingFor: ['Team for Hackathon','Co-founder'], connections: 142, roleType: 'student', github: { username: 'jordanlee', repos: 34, stars: 289, followers: 412, topLanguages: ['TypeScript','React','GraphQL'], contributions: 847, streak: 23 } },
  { id: 'p1', name: 'Raj Kumar', initials: 'RK', color: 'bg-orange-500/20 text-orange-300', gender: 'Male', role: 'ML Engineer', skills: ['Python','TensorFlow','AI','PyTorch'], location: 'Bangalore', country: 'India', gitActivity: '47 commits/mo', bio: '4 yrs building production AI. Open-source contributor.', availability: 'Full-time', experience: 'Expert', domain: ['AI/ML','Data Science'], lookingFor: ['Project Collaboration','Co-founder'], connections: 89, roleType: 'student', github: { username: 'rajkumar_ml', repos: 22, stars: 156, followers: 203, topLanguages: ['Python','Jupyter','Shell'], contributions: 612, streak: 15 } },
  { id: 'p2', name: 'Ananya S.', initials: 'AS', color: 'bg-pink-500/20 text-pink-300', gender: 'Female', role: 'React Developer', skills: ['React','TypeScript','SaaS','Tailwind CSS'], location: 'Mumbai', country: 'India', gitActivity: '62 commits/mo', bio: 'Frontend specialist. Design systems expert.', availability: 'Part-time', experience: 'Intermediate', domain: ['Web Development','UI/UX Design'], lookingFor: ['Team for Hackathon','Freelance Work'], connections: 203, roleType: 'student', github: { username: 'ananya_dev', repos: 18, stars: 94, followers: 178, topLanguages: ['TypeScript','CSS','React'], contributions: 534, streak: 31 } },
  { id: 'p3', name: 'Dev Patel', initials: 'DP', color: 'bg-blue-500/20 text-blue-300', gender: 'Male', role: 'Full-stack Dev', skills: ['Node.js','React','ML','PostgreSQL'], location: 'Pune', country: 'India', gitActivity: '38 commits/mo', bio: 'Bridging frontend and ML. Clean APIs.', availability: 'Weekends only', experience: 'Intermediate', domain: ['Web Development','AI/ML'], lookingFor: ['Learning Partners'], connections: 56, roleType: 'student', github: { username: 'devpatel', repos: 11, stars: 43, followers: 67, topLanguages: ['JavaScript','Python','SQL'], contributions: 289, streak: 7 } },
  { id: 'p4', name: 'Sara Chen', initials: 'SC', color: 'bg-emerald-500/20 text-emerald-300', gender: 'Female', role: 'Data Scientist', skills: ['Python','DataScience','AI','SQL'], location: 'Hyderabad', country: 'India', gitActivity: '29 commits/mo', bio: 'NLP & CV researcher. PhD candidate at IIT.', availability: 'Full-time', experience: 'Expert', domain: ['Data Science','AI/ML'], lookingFor: ['Mentor Guidance'], connections: 118, roleType: 'mentor', github: { username: 'sarachen_ds', repos: 9, stars: 312, followers: 567, topLanguages: ['Python','R','Jupyter'], contributions: 408, streak: 12 } },
  { id: 'p5', name: 'Marco R.', initials: 'MR', color: 'bg-purple-500/20 text-purple-300', gender: 'Male', role: 'DevOps Engineer', skills: ['DevOps','Node.js','TypeScript','Kubernetes'], location: 'Chennai', country: 'India', gitActivity: '55 commits/mo', bio: 'Zero-downtime deployments. IaC evangelist.', availability: 'Contract', experience: 'Expert', domain: ['DevOps','Cloud'], lookingFor: ['Freelance Work'], connections: 74, roleType: 'student', github: { username: 'marco_ops', repos: 27, stars: 198, followers: 143, topLanguages: ['HCL','Shell','YAML'], contributions: 721, streak: 44 } },
  { id: 'p6', name: 'Priya M.', initials: 'PM', color: 'bg-teal-500/20 text-teal-300', gender: 'Female', role: 'UI/UX Designer', skills: ['Figma','Design','Prototyping','React'], location: 'Delhi', country: 'India', gitActivity: '21 commits/mo', bio: 'Micro-interaction obsessed. Accessibility-first.', availability: 'Freelance', experience: 'Intermediate', domain: ['UI/UX Design','Web Development'], lookingFor: ['Team for Hackathon','Freelance Work'], connections: 167, roleType: 'student', github: { username: 'priyam_design', repos: 8, stars: 67, followers: 234, topLanguages: ['CSS','HTML','JavaScript'], contributions: 187, streak: 5 } },
  { id: 'p7', name: 'Akash J.', initials: 'AJ', color: 'bg-yellow-500/20 text-yellow-300', gender: 'Male', role: 'Blockchain Dev', skills: ['Solidity','Web3','React','Ethereum'], location: 'Kolkata', country: 'India', gitActivity: '44 commits/mo', bio: 'DeFi & NFT ecosystem. First DeFi protocol on mainnet.', availability: 'Full-time', experience: 'Intermediate', domain: ['Blockchain','Web Development'], lookingFor: ['Co-founder','Project Collaboration'], connections: 92, roleType: 'student', github: { username: 'akashj_web3', repos: 15, stars: 231, followers: 189, topLanguages: ['Solidity','Rust','TypeScript'], contributions: 463, streak: 19 } },
  { id: 'p8', name: 'Lisa J.', initials: 'LJ', color: 'bg-rose-500/20 text-rose-300', gender: 'Female', role: 'Full-stack Dev', skills: ['React','Node.js','AI','Docker'], location: 'New York', country: 'USA', gitActivity: '41 commits/mo', bio: 'FAANG ex. Ships fast. Mentor for underrepresented devs.', availability: 'Full-time', experience: 'Expert', domain: ['Web Development','DevOps'], lookingFor: ['Job Opportunities','Mentor Guidance'], connections: 215, roleType: 'mentor', github: { username: 'lisaj_dev', repos: 41, stars: 876, followers: 1203, topLanguages: ['TypeScript','Go','Python'], contributions: 1124, streak: 67 } },
];

const MY_TEAMS: Team[] = [
  { id: '1', name: 'AI Startup Project', ownerId: ME_ID, members: [ME_ID,'p1'], maxMembers: 5, tags: ['AI','ML','SaaS'] },
  { id: '2', name: 'Hackathon Alpha', ownerId: '4', members: ['4',ME_ID], maxMembers: 4, tags: ['GreenTech','Mobile'] },
];

const BASE_POSTS: Post[] = [
  { id: 'post1', authorId: 'p2', content: 'Looking for 2 devs to join our HackMIT team! 🚀 Building an AI-powered accessibility tool. Need ML experience + a frontend dev. DM if interested!', tags: ['#hackathon','#AI','#accessibility'], skillTags: ['React','TypeScript','Node.js'], likes: 24, liked: false, bookmarked: false, time: '2h ago', shares: 8, showComments: false, comments: [{ id: 'c1', authorId: 'p1', text: 'This sounds amazing! I have ML experience, DM me!', time: '1h ago' }] },
  { id: 'post2', authorId: 'p4', content: 'Offering free mentorship for junior devs interested in cloud architecture & DevOps. 8+ years at FAANG. Drop a comment if interested!', tags: ['#mentorship','#DevOps','#cloud'], skillTags: ['System Design','AWS','Kubernetes'], likes: 67, liked: false, bookmarked: false, time: '5h ago', shares: 31, showComments: false, comments: [{ id: 'c2', authorId: 'p3', text: "I'd love to learn cloud architecture!", time: '4h ago' }] },
  { id: 'post3', authorId: ME_ID, content: 'Just launched v2 of our design system! 🎉 Dark mode, 60+ new components, full TypeScript support. Check it out and let me know what you think!', tags: ['#design','#typescript','#opensource'], skillTags: ['React','TypeScript','Next.js'], likes: 41, liked: false, bookmarked: false, time: '8h ago', shares: 19, showComments: false, comments: [] },
  { id: 'post4', authorId: 'p7', content: 'Just shipped my first DeFi protocol on testnet! 🎉 6 months of hard work — smart contract passed audit with zero critical issues. Open-sourcing next week.', tags: ['#Web3','#DeFi','#blockchain'], skillTags: ['Solidity','Ethereum','Web3'], likes: 112, liked: true, bookmarked: true, time: '1d ago', shares: 44, showComments: false, comments: [] },
  { id: 'post5', authorId: 'p5', content: "Hot take: most startups don't need Kubernetes. A VPS + Docker Compose handles 95% of use cases. Change my mind 👇", tags: ['#DevOps','#startups'], skillTags: ['DevOps','Docker','Kubernetes'], likes: 89, liked: false, bookmarked: false, time: '2d ago', shares: 55, showComments: false, comments: [{ id: 'c4', authorId: 'p1', text: 'Fully agree. Premature optimisation kills velocity.', time: '2d ago' }] },
  { id: 'post6', authorId: 'p1', content: 'My PyTorch model finally hit 97.3% accuracy 🔥 Two weeks of hyperparameter tuning paid off. Sharing the notebook tomorrow!', tags: ['#AI','#ML','#PyTorch'], skillTags: ['Python','PyTorch','AI'], likes: 88, liked: false, bookmarked: false, time: '3d ago', shares: 33, showComments: false, comments: [] },
];

const TRENDING_SKILLS = [
  { name: 'AI/ML',      icon: Cpu,        count: '12.4k', hot: true  },
  { name: 'React',      icon: Code,       count: '9.8k',  hot: false },
  { name: 'Rust',       icon: Shield,     count: '7.2k',  hot: true  },
  { name: 'Web3',       icon: Globe,      count: '6.1k',  hot: false },
  { name: 'DevOps',     icon: Layers,     count: '5.9k',  hot: false },
  { name: 'Flutter',    icon: Smartphone, count: '4.7k',  hot: false },
  { name: 'PostgreSQL', icon: Database,   count: '4.3k',  hot: false },
];

const SKILL_OPTIONS = ['React','TypeScript','Python','Node.js','AI','ML','Figma','Solidity','Go','Rust','Flutter','Docker','Kubernetes','PostgreSQL','MongoDB','GraphQL','TensorFlow','PyTorch','Next.js','AWS','DataScience','SQL','CSS','Web3'];
const EMOJIS = ['😀','🚀','🔥','👍','💡','✅','🎯','💪','🤝','🎉','❤️','🙌','💻','⚡','🌟','🎊','🛠️','📦','🧠','🏆'];

function getPerson(id: string): Person {
  return ALL_PEOPLE.find(p => p.id === id) ?? ALL_PEOPLE[0];
}
function parseCommits(s: string): number { return parseInt(s) || 0; }

/* ══════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════ */
export default function HomePage() {

  /* ── search ── */
  const [searchQuery, setSearchQuery] = useState('');
  const [showDrop, setShowDrop]       = useState(false);
  const [feedMode, setFeedMode]       = useState<'all'|'saved'>('all');
  const [showSuggestAll, setShowSuggestAll] = useState(false);

  /* ── filters ── */
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [fLocation,  setFLocation]  = useState('');
  const [fGender,    setFGender]    = useState<string[]>([]);
  const [fRole,      setFRole]      = useState<string[]>([]);
  const [fSkills,    setFSkills]    = useState<string[]>([]);
  const [fExp,       setFExp]       = useState<string[]>([]);
  const [fAvail,     setFAvail]     = useState<string[]>([]);
  const [fGithub,    setFGithub]    = useState<string[]>([]);
  const [skillSearch,setSkillSearch]= useState('');

  /* ── feed ── */
  const [posts, setPosts]               = useState<Post[]>(BASE_POSTS);
  const [commentDraft, setCommentDraft] = useState<Record<string,string>>({});
  const [sharePostId, setSharePostId]   = useState<string|null>(null);
  const [menuPostId, setMenuPostId]     = useState<string|null>(null);
  const [shareConnectionsPostId, setShareConnectionsPostId] = useState<string|null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('scout_posts');
    if (stored) {
      setPosts(JSON.parse(stored));
    } else {
      localStorage.setItem('scout_posts', JSON.stringify(BASE_POSTS));
    }
  }, []);

  const safeSetPosts = (fn: (prev: Post[]) => Post[]) => {
    setPosts(prev => {
      const next = fn(prev);
      localStorage.setItem('scout_posts', JSON.stringify(next));
      return next;
    });
  };

  /* ── connections ── */
  const [connected, setConnected] = useState<Set<string>>(new Set(['p4']));
  const [pending,   setPending]   = useState<Set<string>>(new Set());

  /* ── modals ── */
  const [addTeamFor,  setAddTeamFor]  = useState<Person|null>(null);
  const [teamsState,  setTeamsState]  = useState<Team[]>(MY_TEAMS);
  const [profModal,   setProfModal]   = useState<Person|null>(null);

  /* ── toast ── */
  const [toast, setToast] = useState<string|null>(null);

  /* ── composer ── */
  const [compText,    setCompText]    = useState('');
  const [compImage,   setCompImage]   = useState<string|null>(null);
  const [compTags,    setCompTags]    = useState('');
  const [showEmoji,   setShowEmoji]   = useState(false);
  const [showTagInput,setShowTagInput]= useState(false);
  const [composerFocused, setComposerFocused] = useState(false);

  const compFileRef = useRef<HTMLInputElement>(null);
  const compTextRef = useRef<HTMLTextAreaElement>(null);
  const searchRef   = useRef<HTMLDivElement>(null);

  const me           = getPerson(ME_ID);
  const myOwnedTeams = teamsState.filter(t => t.ownerId === ME_ID);
  const amOwner      = myOwnedTeams.length > 0;
  const suggested    = ALL_PEOPLE.filter(p => p.id !== ME_ID && !connected.has(p.id)).slice(0,5);

  /* ── active filter chips ── */
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

  const clearAll = () => {
    setFLocation('');setFGender([]);setFRole([]);setFSkills([]);
    setFExp([]);setFAvail([]);setFGithub([]);setSearchQuery('');
  };

  const tog = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(v=>v!==val) : [...arr, val];

  /* ── filter people ── */
  const matchPerson = useCallback((p: Person): boolean => {
    if (p.id === ME_ID) return false;
    const q = searchQuery.toLowerCase();
    if (q) {
      const hit = [p.name, p.role, p.location, p.bio, ...p.skills, ...p.lookingFor]
        .some(v => v.toLowerCase().includes(q));
      if (!hit) return false;
    }
    if (fLocation && !p.location.toLowerCase().includes(fLocation.toLowerCase())) return false;
    if (fGender.length && !fGender.includes(p.gender)) return false;
    if (fRole.length && !fRole.some(r => p.roleType===r.toLowerCase() || p.role.toLowerCase().includes(r.toLowerCase()))) return false;
    if (fExp.length && !fExp.includes(p.experience)) return false;
    if (fAvail.length && !fAvail.includes(p.availability)) return false;
    if (fSkills.length && !fSkills.every(s => p.skills.includes(s))) return false;
    if (fGithub.includes('30+ commits/mo') && parseCommits(p.gitActivity) < 30) return false;
    if (fGithub.includes('60+ commits/mo') && parseCommits(p.gitActivity) < 60) return false;
    return true;
  }, [searchQuery, fLocation, fGender, fRole, fExp, fAvail, fSkills, fGithub]);

  const peopleResults = ALL_PEOPLE.filter(matchPerson);

  /* ── feed sort ── */
  const visiblePosts = (() => {
    let filtered = posts;
    if (feedMode === 'saved') {
      filtered = filtered.filter(p => p.bookmarked);
    }
    const q = searchQuery.toLowerCase();
    const matchIds = new Set(peopleResults.map(p=>p.id));
    
    if (q || activeChips.length > 0) {
      filtered = filtered.filter(p => matchIds.has(p.authorId) || p.content.toLowerCase().includes(q) || p.skillTags.some(s=>s.toLowerCase().includes(q)) || p.tags.some(t=>t.toLowerCase().includes(q)));
    }
    
    return [...filtered].sort((a,b) => {
      const am = matchIds.has(a.authorId)||a.content.toLowerCase().includes(q)||a.skillTags.some(s=>s.toLowerCase().includes(q))||a.tags.some(t=>t.toLowerCase().includes(q));
      const bm = matchIds.has(b.authorId)||b.content.toLowerCase().includes(q)||b.skillTags.some(s=>s.toLowerCase().includes(q))||b.tags.some(t=>t.toLowerCase().includes(q));
      if ((q||activeChips.length>0) && am!==bm) return am ? -1 : 1;
      return 0;
    });
  })();

  /* ── outside click ── */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowDrop(false);
      if (sharePostId && !(e.target as Element)?.closest('[data-share]')) setSharePostId(null);
      if (menuPostId && !(e.target as Element)?.closest('[data-menu]')) setMenuPostId(null);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [sharePostId, menuPostId]);

  /* ── toast ── */
  const fire = (msg: string) => { setToast(msg); setTimeout(()=>setToast(null), 2600); };

  /* ── connect ── */
  const handleConnect = (id: string) => {
    if (connected.has(id)) return;
    if (pending.has(id)) {
      setPending(p=>{const s=new Set(p);s.delete(id);return s;});
      fire('Request withdrawn');
    } else {
      setPending(p=>new Set([...p,id]));
      fire('Connection request sent! 🤝');
      setTimeout(()=>{
        setPending(p=>{const s=new Set(p);s.delete(id);return s;});
        setConnected(p=>new Set([...p,id]));
      }, 2000);
    }
  };

  /* ── team ── */
  const handleAddToTeam = (person: Person, teamId: string) => {
    setTeamsState(prev=>prev.map(t=>t.id===teamId&&!t.members.includes(person.id)?{...t,members:[...t.members,person.id]}:t));
    setAddTeamFor(null);
    fire(`${person.name} added to team! ✅`);
  };

  /* ── post actions ── */
  const likePost       = (id: string) => safeSetPosts(p=>p.map(x=>x.id===id?{...x,liked:!x.liked,likes:x.liked?x.likes-1:x.likes+1}:x));
  const savePost       = (id: string) => { safeSetPosts(p=>p.map(x=>x.id===id?{...x,bookmarked:!x.bookmarked}:x)); fire('Post saved! 🔖'); };
  const toggleComments = (id: string) => safeSetPosts(p=>p.map(x=>x.id===id?{...x,showComments:!x.showComments}:x));
  
  const handleDeletePost = (id: string) => {
    safeSetPosts(p=>p.filter(x=>x.id!==id));
    setMenuPostId(null);
    fire('Post deleted from feed.');
  };

  const submitComment = (postId: string) => {
    const text=(commentDraft[postId]||'').trim(); if(!text) return;
    safeSetPosts(p=>p.map(x=>x.id===postId?{...x,comments:[...x.comments,{id:String(Date.now()),authorId:ME_ID,text,time:'Just now'}]}:x));
    setCommentDraft(prev=>({...prev,[postId]:''}));
  };

  const handleShareAction = (postId: string, method: 'whatsapp'|'copy') => {
    const post=posts.find(p=>p.id===postId); if(!post) return;
    safeSetPosts(p=>p.map(x=>x.id===postId?{...x,shares:x.shares+1}:x));
    if (method==='whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(post.content+'\n\nShared via Scout')}`, '_blank');
    } else {
      navigator.clipboard.writeText(post.content).then(()=>fire('Copied to clipboard! 📋'));
    }
    setSharePostId(null);
  };

  /* ── composer ── */
  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file=e.target.files?.[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=()=>setCompImage(reader.result as string);
    reader.readAsDataURL(file); e.target.value='';
  };

  const insertEmoji = (em: string) => {
    const el=compTextRef.current;
    if (el) {
      const s=el.selectionStart??compText.length, e2=el.selectionEnd??compText.length;
      const next=compText.slice(0,s)+em+compText.slice(e2);
      setCompText(next);
      setTimeout(()=>{el.focus();el.setSelectionRange(s+em.length,s+em.length);});
    } else setCompText(p=>p+em);
    setShowEmoji(false);
  };

  const handlePost = () => {
    if (!compText.trim() && !compImage) return;
    const tags=compTags.split(' ').map(t=>t.trim()).filter(t=>t.startsWith('#')&&t.length>1);
    const np: Post={
      id:String(Date.now()), authorId:ME_ID, content:compText,
      tags, skillTags:[], likes:0, liked:false, bookmarked:false,
      time:'Just now', shares:0, showComments:false, comments:[],
      type: 'regular',
      ...(compImage?{image:compImage}:{})
    };
    safeSetPosts(prev=>[np,...prev]);
    setCompText(''); setCompImage(null); setCompTags('');
    setShowEmoji(false); setShowTagInput(false);
    setComposerFocused(false);
    fire('Post published! 🚀');
  };

  /* ── highlight helper ── */
  const hl = (text: string) => {
    const q=searchQuery.trim(); if(!q) return <>{text}</>;
    const idx=text.toLowerCase().indexOf(q.toLowerCase());
    if(idx===-1) return <>{text}</>;
    return <>{text.slice(0,idx)}<mark className="bg-violet-500/25 text-violet-300 rounded-sm not-italic">{text.slice(idx,idx+q.length)}</mark>{text.slice(idx+q.length)}</>;
  };

  /* ════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════ */
  return (
    <div className="h-screen overflow-hidden flex flex-col text-white"
      style={{ backgroundColor:BG, fontFamily:"'DM Sans','Outfit',sans-serif" }}>

      {/* ── TOAST ── */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[500] flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-semibold shadow-2xl backdrop-blur-xl whitespace-nowrap"
          style={{ backgroundColor:'rgba(20,20,40,0.97)', borderColor:'rgba(196,170,241,0.3)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C4AAF1]"/>{toast}
        </div>
      )}

      {/* ════ HEADER ════ */}
      <header className="flex-shrink-0 border-b z-40"
        style={{ backgroundColor:'rgba(13,13,26,0.96)', borderColor:BORDER, backdropFilter:'blur(20px)' }}>
        <div className="max-w-[1440px] mx-auto px-6 h-[58px] flex items-center gap-4">

          {/* Logo */}
          <div className="hidden lg:flex items-center gap-2.5 w-[240px] flex-shrink-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background:'linear-gradient(135deg,rgba(196,170,241,0.3),rgba(196,170,241,0.08))', border:'1px solid rgba(196,170,241,0.25)' }}>
              <Zap size={15} className="text-[#C4AAF1]"/>
            </div>
            <span className="font-black text-[17px] tracking-tight"
              style={{ background:'linear-gradient(90deg,#fff,rgba(255,255,255,0.5))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Scout
            </span>
          </div>

          {/* Search */}
          <div className="flex-1 relative" ref={searchRef}>
            <div className="flex items-center gap-2 h-9 rounded-xl px-3.5 transition-all focus-within:ring-1 focus-within:ring-[#C4AAF1]/30"
              style={{ backgroundColor:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <Search size={14} className="text-gray-500 flex-shrink-0"/>
              <input type="text" value={searchQuery}
                onChange={e=>{setSearchQuery(e.target.value);setShowDrop(!!e.target.value);}}
                onFocus={()=>searchQuery&&setShowDrop(true)}
                placeholder="Search people, skills, roles, posts…"
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"/>
              {searchQuery&&<button onClick={()=>{setSearchQuery('');setShowDrop(false);}} className="text-gray-500 hover:text-white transition-colors"><X size={13}/></button>}
            </div>

            {/* People Dropdown removed -- showing inline in feed */}
          </div>

          {/* Filter button */}
          <button onClick={()=>setShowFilterBar(p=>!p)}
            className={`flex items-center gap-2 h-9 px-4 rounded-xl border text-sm font-bold transition-all flex-shrink-0 ${showFilterBar||activeChips.length>0?'text-[#C4AAF1] bg-[#C4AAF1]/10':'text-gray-400 hover:text-white hover:border-white/20'}`}
            style={{ borderColor:showFilterBar||activeChips.length>0?'rgba(196,170,241,0.4)':BORDER }}>
            <SlidersHorizontal size={14}/>
            <span className="hidden sm:inline">Filter</span>
            {activeChips.length>0&&<span className="min-w-[18px] h-[18px] rounded-full bg-[#C4AAF1] text-[#0d0d1a] text-[10px] font-black flex items-center justify-center px-1">{activeChips.length}</span>}
          </button>
        </div>

        {/* ── FILTER BAR ── */}
        {showFilterBar&&(
          <div className="border-t px-6 py-4 space-y-4"
            style={{ borderColor:BORDER, backgroundColor:'rgba(13,13,26,0.98)' }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Location */}
              <div>
                <p className="fl-label">Location</p>
                <input type="text" value={fLocation} onChange={e=>setFLocation(e.target.value)}
                  placeholder="e.g. Bangalore"
                  className="w-full h-8 rounded-xl px-3 text-xs text-white placeholder-gray-600 focus:outline-none transition-all focus:ring-1 focus:ring-[#C4AAF1]/30"
                  style={{ backgroundColor:'rgba(255,255,255,0.05)', border:`1px solid ${BORDER}` }}/>
              </div>

              {/* Skills */}
              <div>
                <p className="fl-label">Skills</p>
                <div className="relative">
                  <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"/>
                  <input type="text" value={skillSearch} onChange={e=>setSkillSearch(e.target.value)}
                    placeholder="Search skills…"
                    className="w-full h-8 rounded-xl pl-7 pr-3 text-xs text-white placeholder-gray-600 focus:outline-none transition-all"
                    style={{ backgroundColor:'rgba(255,255,255,0.05)', border:`1px solid ${BORDER}` }}/>
                </div>
                {skillSearch&&(
                  <div className="mt-1.5 flex flex-wrap gap-1 max-h-14 overflow-y-auto" style={{ scrollbarWidth:'none' }}>
                    {SKILL_OPTIONS.filter(s=>!fSkills.includes(s)&&s.toLowerCase().includes(skillSearch.toLowerCase())).slice(0,8).map(s=>(
                      <button key={s} onClick={()=>{setFSkills(p=>[...p,s]);setSkillSearch('');}}
                        className="text-[10px] px-2 py-0.5 rounded-full border text-gray-400 hover:text-[#C4AAF1] hover:border-[#C4AAF1]/40 transition-all"
                        style={{ borderColor:BORDER }}>{s}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* GitHub */}
              <div>
                <p className="fl-label">GitHub Activity</p>
                <div className="flex flex-col gap-1.5">
                  {['30+ commits/mo','60+ commits/mo'].map(opt=>(
                    <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                      <div onClick={()=>setFGithub(p=>tog(p,opt))}
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-all cursor-pointer ${fGithub.includes(opt)?'bg-[#C4AAF1] border-[#C4AAF1]':'border-gray-600 group-hover:border-[#C4AAF1]/50'}`}>
                        {fGithub.includes(opt)&&<Check size={10} className="text-[#0d0d1a]"/>}
                      </div>
                      <span className="text-[11px] text-gray-400 group-hover:text-gray-200 transition-colors">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <p className="fl-label">Gender</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Male','Female','Non-binary','Other'].map(g=>(
                    <button key={g} onClick={()=>setFGender(p=>tog(p,g))}
                      className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all ${fGender.includes(g)?'bg-[#C4AAF1]/15 border-[#C4AAF1]/50 text-[#C4AAF1]':'border-white/[0.08] text-gray-500 hover:text-gray-300 hover:border-white/20'}`}>{g}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Role */}
              <div>
                <p className="fl-label">Role</p>
                <div className="flex flex-wrap gap-1.5">
                  {['student','mentor','Developer','Designer','DevOps'].map(r=>(
                    <button key={r} onClick={()=>setFRole(p=>tog(p,r))}
                      className={`text-[11px] px-2.5 py-1 rounded-full border font-medium capitalize transition-all ${fRole.includes(r)?'bg-[#C4AAF1]/15 border-[#C4AAF1]/50 text-[#C4AAF1]':'border-white/[0.08] text-gray-500 hover:text-gray-300 hover:border-white/20'}`}>{r}</button>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <p className="fl-label">Experience Level</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Beginner','Intermediate','Expert'].map(e=>(
                    <button key={e} onClick={()=>setFExp(p=>tog(p,e))}
                      className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all ${fExp.includes(e)?'bg-[#C4AAF1]/15 border-[#C4AAF1]/50 text-[#C4AAF1]':'border-white/[0.08] text-gray-500 hover:text-gray-300 hover:border-white/20'}`}>{e}</button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <p className="fl-label">Availability</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Full-time','Part-time','Weekends only','Contract','Freelance'].map(a=>(
                    <button key={a} onClick={()=>setFAvail(p=>tog(p,a))}
                      className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all ${fAvail.includes(a)?'bg-[#C4AAF1]/15 border-[#C4AAF1]/50 text-[#C4AAF1]':'border-white/[0.08] text-gray-500 hover:text-gray-300 hover:border-white/20'}`}>{a}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active chips */}
            {activeChips.length>0&&(
              <div className="flex items-center gap-2 flex-wrap pt-1 border-t" style={{ borderColor:BORDER }}>
                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Active:</span>
                {activeChips.map((c,i)=>(
                  <span key={i} className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-medium"
                    style={{ backgroundColor:'rgba(196,170,241,0.12)', border:'1px solid rgba(196,170,241,0.3)', color:'#C4AAF1' }}>
                    {c.label}
                    <button onClick={()=>removeChip(c)} className="opacity-70 hover:opacity-100 ml-0.5"><X size={10}/></button>
                  </span>
                ))}
                <button onClick={clearAll} className="text-[11px] text-gray-500 hover:text-red-400 font-bold transition-colors flex items-center gap-1">
                  <X size={10}/>Clear all
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ════ 3-COLUMN BODY ════ */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-[1440px] mx-auto px-6 flex gap-6">

          {/* ════ LEFT SIDEBAR — static, no scroll, NO stats/teams ════ */}
          <aside className="hidden lg:flex flex-col w-[230px] flex-shrink-0 py-5 gap-4 overflow-hidden">

            {/* Clean profile card — name, role, location, availability ONLY */}
            <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor:SURF, borderColor:BORDER }}>
              <div className="h-14" style={{ background:'linear-gradient(135deg,rgba(196,170,241,0.18),rgba(80,50,180,0.05))' }}/>
              <div className="px-4 pb-4 -mt-6">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-base mb-2.5 border-[3px] ${me.color}`}
                  style={{ borderColor:SURF }}>{me.initials}</div>
                <p className="font-black text-sm">{me.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{me.role}</p>
                <p className="text-gray-600 text-[10px] flex items-center gap-1 mt-0.5"><MapPin size={8}/>{me.location}</p>
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ backgroundColor:'rgba(196,170,241,0.1)', border:'1px solid rgba(196,170,241,0.2)', color:'#C4AAF1' }}>
                  {me.availability}
                </span>
              </div>
            </div>

            {/* Navigation links */}
            <div className="rounded-2xl border p-2 space-y-0.5" style={{ backgroundColor:SURF, borderColor:BORDER }}>
              {[
                { icon:<Layers size={13}/>, label:'All Posts', count: null, mode: 'all' as const },
                { icon:<Bookmark size={13}/>, label:'Saved Posts', count: posts.filter(p=>p.bookmarked).length, mode: 'saved' as const },
              ].map(item=>(
                <button key={item.label} onClick={() => setFeedMode(item.mode)} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all group ${feedMode === item.mode ? 'bg-white/[0.08]' : 'hover:bg-white/[0.05]'}`}>
                  <div className={`flex items-center gap-2.5 transition-colors ${feedMode === item.mode ? 'text-[#C4AAF1]' : 'text-gray-400 group-hover:text-gray-200'}`}>
                    {item.icon}
                    <span className="text-xs font-semibold">{item.label}</span>
                  </div>
                  {item.count!==null&&item.count!==undefined&&item.count>0&&(
                    <span className="text-[10px] font-black text-[#C4AAF1] px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor:'rgba(196,170,241,0.1)' }}>{item.count}</span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          {/* ════ CENTER FEED — ONLY THIS SCROLLS ════ */}
          <main className="flex-1 min-w-0 overflow-y-auto py-5"
            style={{ scrollbarWidth:'thin', scrollbarColor:'rgba(196,170,241,0.15) transparent' }}>
            <div className="flex flex-col gap-4 max-w-[680px] mx-auto">

              {/* search/filter status */}
              {(searchQuery||activeChips.length>0)&&(
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm text-gray-400">
                    {searchQuery&&<>Results for <span className="text-white font-bold">"{searchQuery}"</span> · </>}
                    <span className="text-[#C4AAF1] font-bold">{visiblePosts.length}</span> post{visiblePosts.length!==1?'s':''}
                  </p>
                  <button onClick={clearAll} className="text-xs text-gray-600 hover:text-white transition-colors flex items-center gap-1">
                    <X size={10}/>Clear
                  </button>
                </div>
              )}

              {/* ════ SEARCH PEOPLE RESULTS ════ */}
              {(searchQuery || activeChips.length > 0) && peopleResults.length > 0 && (
                <div className="space-y-3 mb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#C4AAF1] pl-1">Matching People</p>
                  {peopleResults.map(person => (
                    <div key={person.id} className="flex items-center gap-4 p-4 rounded-2xl border transition-all hover:bg-white/[0.02]"
                      style={{ backgroundColor:SURF, borderColor:BORDER }}>
                      <div onClick={()=>setProfModal(person)}
                        className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-lg cursor-pointer ${person.color}`}>
                        {person.initials}
                      </div>
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={()=>setProfModal(person)}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm hover:text-[#C4AAF1] transition-colors">{person.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${person.roleType==='mentor'?'bg-amber-500/15 text-amber-300':'bg-[#C4AAF1]/15 text-[#C4AAF1]'}`}>{person.roleType}</span>
                          <span className="text-[10px] text-gray-400">{person.experience}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5"><MapPin size={10} className="inline mr-0.5"/>{person.location} · {person.role}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {person.skills.slice(0,4).map(s=>(
                            <span key={s} className="text-[9px] px-2 py-0.5 rounded-md font-medium" style={{ backgroundColor:'rgba(196,170,241,0.1)', color:'#C4AAF1' }}>{s}</span>
                          ))}
                          {person.skills.length > 4 && <span className="text-[9px] px-2 py-0.5 rounded-md bg-white/[0.05] text-gray-500">+{person.skills.length - 4} more</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {amOwner&&<button onClick={(e)=>{e.stopPropagation();setAddTeamFor(person);}} className="text-[11px] px-3 py-2 rounded-xl border font-bold text-[#C4AAF1] hover:bg-[#C4AAF1]/10 transition-all" style={{borderColor:'rgba(196,170,241,0.3)'}}><Users size={12} className="inline mr-1"/>Team</button>}
                        <button onClick={(e)=>{e.stopPropagation();handleConnect(person.id);}}
                          className={`flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-xl font-bold transition-all ${connected.has(person.id)?'bg-emerald-500/15 text-emerald-400':pending.has(person.id)?'bg-amber-500/15 text-amber-400':'bg-[#C4AAF1] text-[#0d0d1a] hover:brightness-110'}`}>
                          {connected.has(person.id)?<><Check size={11}/>Connected</>:pending.has(person.id)?'Pending…':<><UserPlus size={11}/>Connect</>}
                        </button>
                      </div>
                    </div>
                  ))}
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#C4AAF1] pl-1 mt-6 mb-1">Posts</p>
                </div>
              )}

              {/* ════ POST COMPOSER ════ */}
              <div className="rounded-2xl border overflow-hidden transition-all"
                style={{ backgroundColor:SURF, borderColor:composerFocused?'rgba(196,170,241,0.25)':BORDER }}>

                {/* Header */}
                <div className="flex gap-3 p-4 pb-3">
                  <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-sm ${me.color}`}>
                    {me.initials}
                  </div>
                  <textarea
                    ref={compTextRef}
                    value={compText}
                    onChange={e=>setCompText(e.target.value)}
                    onFocus={()=>setComposerFocused(true)}
                    onKeyDown={e=>{if(e.key==='Enter'&&e.metaKey)handlePost();}}
                    placeholder="Share a project, idea, or find collaborators…"
                    rows={composerFocused||compText.length>0?3:2}
                    className="flex-1 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none resize-none leading-relaxed transition-all"
                    style={{ backgroundColor:'rgba(255,255,255,0.04)', border:`1px solid ${BORDER}` }}
                  />
                </div>

                {/* Image preview */}
                {compImage&&(
                  <div className="mx-4 mb-3 relative">
                    <img src={compImage} alt="" className="w-full max-h-48 object-cover rounded-xl" style={{ border:`1px solid ${BORDER}` }}/>
                    <button onClick={()=>setCompImage(null)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/80 flex items-center justify-center hover:bg-black transition-all">
                      <X size={11}/>
                    </button>
                  </div>
                )}

                {/* Emoji picker */}
                {showEmoji&&(
                  <div className="mx-4 mb-3 p-3 rounded-xl border flex flex-wrap gap-2"
                    style={{ backgroundColor:CARD, borderColor:BORDER }}>
                    {EMOJIS.map(em=><button key={em} onClick={()=>insertEmoji(em)} className="text-xl hover:scale-125 transition-transform leading-none">{em}</button>)}
                  </div>
                )}

                {/* Tag input */}
                {showTagInput&&(
                  <div className="mx-4 mb-3">
                    <input type="text" value={compTags} onChange={e=>setCompTags(e.target.value)}
                      placeholder="#react #hackathon #ai  (space separated)"
                      className="w-full h-8 rounded-xl px-3 text-xs text-white placeholder-gray-600 focus:outline-none transition-all"
                      style={{ backgroundColor:'rgba(255,255,255,0.04)', border:`1px solid ${BORDER}` }}/>
                  </div>
                )}

                {/* Toolbar + Post button */}
                <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor:BORDER }}>
                  <div className="flex items-center gap-0.5">
                    <input type="file" accept="image/*" ref={compFileRef} className="hidden" onChange={handleImagePick}/>
                    <button onClick={()=>{compFileRef.current?.click(); setComposerFocused(true);}}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${compImage?'text-[#C4AAF1] bg-[#C4AAF1]/10':'text-gray-500 hover:text-gray-200 hover:bg-white/[0.05]'}`}>
                      <ImageIcon size={14}/><span className="hidden sm:inline">Photo</span>
                    </button>
                    <button onClick={()=>{setShowEmoji(p=>!p);setShowTagInput(false);setComposerFocused(true);}}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${showEmoji?'text-[#C4AAF1] bg-[#C4AAF1]/10':'text-gray-500 hover:text-gray-200 hover:bg-white/[0.05]'}`}>
                      <Smile size={14}/><span className="hidden sm:inline">Emoji</span>
                    </button>
                    <button onClick={()=>{setShowTagInput(p=>!p);setShowEmoji(false);setComposerFocused(true);}}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${showTagInput?'text-[#C4AAF1] bg-[#C4AAF1]/10':'text-gray-500 hover:text-gray-200 hover:bg-white/[0.05]'}`}>
                      <Hash size={14}/><span className="hidden sm:inline">Tags</span>
                    </button>
                  </div>
                  <button onClick={handlePost}
                    disabled={!compText.trim()&&!compImage}
                    className="flex items-center gap-2 font-black text-sm px-5 py-1.5 rounded-xl transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:brightness-110"
                    style={{ backgroundColor:'#C4AAF1', color:'#0d0d1a', boxShadow:'0 0 18px rgba(196,170,241,0.2)' }}>
                    <Send size={13}/>Post
                  </button>
                </div>
              </div>

              {/* ════ POSTS ════ */}
              {visiblePosts.length===0?(
                <div className="rounded-2xl border p-14 text-center" style={{ backgroundColor:SURF, borderColor:BORDER }}>
                  <Search size={32} className="mx-auto text-gray-700 mb-3"/>
                  <p className="text-gray-500 font-semibold text-sm">No posts match your search.</p>
                  <button onClick={clearAll} className="mt-3 text-xs text-[#C4AAF1] font-bold hover:brightness-125 transition-all">Clear search</button>
                </div>
              ):visiblePosts.map(post=>{
                const author=getPerson(post.authorId);
                const isOwn=post.authorId===ME_ID;
                const isMatch=searchQuery&&(
                  author.name.toLowerCase().includes(searchQuery.toLowerCase())||
                  author.skills.some(s=>s.toLowerCase().includes(searchQuery.toLowerCase()))
                );

                return (
                  <article key={post.id}
                    className={`rounded-2xl border overflow-visible transition-all`}
                    style={{ backgroundColor:SURF, borderColor:isMatch?'rgba(196,170,241,0.22)':BORDER }}>
                    <div className="p-5">

                      {/* author row */}
                      <div className="flex items-start justify-between mb-3 relative">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={()=>setProfModal(author)}>
                          <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm ${author.color}`}>{author.initials}</div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm group-hover:text-[#C4AAF1] transition-colors">{author.name}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${author.roleType==='mentor'?'bg-amber-500/15 text-amber-300':'bg-[#C4AAF1]/15 text-[#C4AAF1]'}`}>{author.roleType}</span>
                              {isOwn&&<span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-gray-500 font-semibold">You</span>}
                            </div>
                            <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={9}/>{author.location} · {post.time}</p>
                          </div>
                        </div>
                        <button onClick={(e)=>{e.stopPropagation();setMenuPostId(menuPostId===post.id?null:post.id);}} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/[0.05] transition-all"><MoreHorizontal size={15}/></button>
                        {menuPostId===post.id && (
                          <div data-menu className="absolute top-8 right-0 rounded-xl border shadow-2xl overflow-hidden z-[200] w-48"
                               style={{ backgroundColor:'rgba(16,16,34,0.99)', border:'1px solid rgba(255,255,255,0.1)' }}>
                            <button onClick={()=>handleDeletePost(post.id)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.05] transition-all text-left text-red-400">
                              <Trash2 size={14}/>
                              <span className="text-sm font-bold">Delete from Feed</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* content */}
                      {post.type === 'team' ? (
                        <div className="mb-4 p-4 rounded-2xl border" style={{ backgroundColor:'rgba(0,0,0,0.2)', borderColor:BORDER }}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#C4AAF1]/10 border border-[#C4AAF1]/20">
                              <Users size={20} className="text-[#C4AAF1]"/>
                            </div>
                            <div>
                                <h4 className="font-black text-lg">{post.teamData?.name || 'New Team'}</h4>
                                <p className="text-xs text-[#C4AAF1] font-bold">Public Team</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed mb-4">{post.content}</p>
                          <button onClick={()=>{
                            const reqs = JSON.parse(localStorage.getItem('scout_join_requests') || '[]');
                            const alreadyReq = reqs.find((r:any) => r.teamId === post.teamId && r.id === me.id);
                            if (alreadyReq) {
                              fire('You have already sent a request to this team!');
                              return;
                            }
                            reqs.push({
                              id: me.id, name: me.name, role: me.role, location: me.location, skills: me.skills, initials: me.initials, color: me.color, teamId: post.teamId, gitActivity: me.gitActivity
                            });
                            localStorage.setItem('scout_join_requests', JSON.stringify(reqs));
                            fire('Join request sent to team creator!');
                          }} className="w-full py-2.5 rounded-xl font-bold text-sm transition-all text-[#0d0d1a] bg-[#C4AAF1] hover:brightness-110">
                            Request to Join
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-200 text-sm leading-relaxed mb-3">{hl(post.content)}</p>
                          {/* image */}
                          {post.image&&(
                            <div className="mb-3 rounded-xl overflow-hidden" style={{ border:`1px solid ${BORDER}` }}>
                              <img src={post.image} alt="" className="w-full max-h-64 object-cover"/>
                            </div>
                          )}
                        </>
                      )}

                      {/* skill tags — clickable */}
                      {post.skillTags.length>0&&(
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                          {post.skillTags.map(s=>(
                            <button key={s} onClick={()=>setSearchQuery(s)}
                              className="text-xs px-2.5 py-1 rounded-full font-medium hover:bg-[#C4AAF1]/20 transition-all"
                              style={{ backgroundColor:'rgba(196,170,241,0.1)', border:'1px solid rgba(196,170,241,0.18)', color:'#C4AAF1' }}>
                              {s}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* hash tags */}
                      {post.tags.length>0&&(
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map(t=>(
                            <button key={t} onClick={()=>setSearchQuery(t.replace('#',''))}
                              className="text-[11px] text-gray-600 hover:text-[#C4AAF1] transition-colors">{t}</button>
                          ))}
                        </div>
                      )}

                      {/* counts */}
                      {(post.likes>0||post.comments.length>0||post.shares>0)&&(
                        <div className="flex items-center justify-between text-[11px] text-gray-600 mb-3 pb-3 border-b" style={{ borderColor:BORDER }}>
                          <span>{post.likes>0?`${post.likes} like${post.likes!==1?'s':''}`:''}</span>
                          <div className="flex gap-3">
                            {post.comments.length>0&&<button onClick={()=>toggleComments(post.id)} className="hover:text-[#C4AAF1] transition-colors">{post.comments.length} comment{post.comments.length>1?'s':''}</button>}
                            {post.shares>0&&<span>{post.shares} shares</span>}
                          </div>
                        </div>
                      )}

                      {/* ── ACTION BAR ──
                          Own posts:    Like · Share · Save
                          Others posts: Like · Comment · Share · Save
                          NO Connect on any post
                      */}
                      <div className="flex items-center gap-1">
                        {/* Like */}
                        <button onClick={()=>likePost(post.id)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold flex-1 justify-center transition-all ${post.liked?'text-rose-400 bg-rose-500/10':'text-gray-500 hover:text-rose-400 hover:bg-rose-500/10'}`}>
                          <Heart size={14} fill={post.liked?'currentColor':'none'}/><span className="hidden sm:inline">Like</span>
                        </button>

                        {/* Comment — others only */}
                        {!isOwn&&(
                          <button onClick={()=>toggleComments(post.id)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold flex-1 justify-center transition-all ${post.showComments?'text-sky-400 bg-sky-500/10':'text-gray-500 hover:text-sky-400 hover:bg-sky-500/10'}`}>
                            <MessageCircle size={14}/><span className="hidden sm:inline">Comment</span>
                          </button>
                        )}

                        {/* Share with popup */}
                        <div className="flex-1 relative">
                          <button onClick={e=>{e.stopPropagation();setSharePostId(sharePostId===post.id?null:post.id);}}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold w-full justify-center text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all">
                            <Share2 size={14}/><span className="hidden sm:inline">Share</span>
                          </button>
                          {sharePostId===post.id&&(
                            <div data-share className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded-2xl border shadow-2xl overflow-hidden z-[200] w-52"
                              style={{ backgroundColor:'rgba(16,16,34,0.99)', border:'1px solid rgba(255,255,255,0.1)' }}
                              onClick={e=>e.stopPropagation()}>
                              <div className="flex items-center justify-between px-4 pt-3 pb-1.5">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Share via</p>
                                <button onClick={()=>setSharePostId(null)} className="text-gray-600 hover:text-white transition-colors"><X size={12}/></button>
                              </div>
                              <button onClick={()=>handleShareAction(post.id,'whatsapp')}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.05] transition-all text-left">
                                <div className="w-8 h-8 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
                                  <MessageSquare size={14} className="text-green-400"/>
                                </div>
                                <div>
                                  <p className="text-sm font-bold">WhatsApp</p>
                                  <p className="text-[10px] text-gray-500">Send to chat</p>
                                </div>
                              </button>
                              <button onClick={()=>handleShareAction(post.id,'copy')}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.05] transition-all text-left mb-1">
                                <div className="w-8 h-8 rounded-xl bg-white/[0.07] flex items-center justify-center flex-shrink-0">
                                  <Copy size={14} className="text-gray-400"/>
                                </div>
                                <div>
                                  <p className="text-sm font-bold">Copy link</p>
                                  <p className="text-[10px] text-gray-500">Copy to clipboard</p>
                                </div>
                              </button>
                              <button onClick={()=>{setShareConnectionsPostId(post.id);setSharePostId(null);}} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.05] transition-all text-left mb-1">
                                <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                                  <Users size={14} className="text-blue-400"/>
                                </div>
                                <div>
                                  <p className="text-sm font-bold">Share to Connections</p>
                                  <p className="text-[10px] text-gray-500">Send privately</p>
                                </div>
                              </button>
                              <button onClick={()=>{setSharePostId(null);fire('Team sharing coming soon! 🚀');}} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.05] transition-all text-left">
                                <div className="w-8 h-8 rounded-xl bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                                  <Users size={14} className="text-purple-400"/>
                                </div>
                                <div>
                                  <p className="text-sm font-bold">Share to Team</p>
                                  <p className="text-[10px] text-gray-500">Send to a specific team</p>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Save */}
                        <button onClick={()=>savePost(post.id)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold flex-1 justify-center transition-all ${post.bookmarked?'text-[#C4AAF1] bg-[#C4AAF1]/10':'text-gray-500 hover:text-[#C4AAF1] hover:bg-[#C4AAF1]/10'}`}>
                          <Bookmark size={14} fill={post.bookmarked?'currentColor':'none'}/><span className="hidden sm:inline">Save</span>
                        </button>
                      </div>
                    </div>

                    {/* Comments section */}
                    {post.showComments&&!isOwn&&(
                      <div className="border-t px-5 pt-3 pb-4" style={{ backgroundColor:'rgba(0,0,0,0.18)', borderColor:BORDER }}>
                        {post.comments.length>0&&(
                          <div className="space-y-2.5 mb-3">
                            {post.comments.map(c=>{
                              const ca=getPerson(c.authorId);
                              return (
                                <div key={c.id} className="flex gap-2.5">
                                  <div className={`w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-[10px] ${ca.color}`}>{ca.initials}</div>
                                  <div className="flex-1 rounded-xl px-3 py-2" style={{ backgroundColor:'rgba(255,255,255,0.04)' }}>
                                    <p className="text-xs font-bold text-[#C4AAF1]">{ca.name} <span className="text-gray-600 font-normal">{c.time}</span></p>
                                    <p className="text-xs text-gray-300 mt-0.5">{c.text}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <div className="flex gap-2.5">
                          <div className={`w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-[10px] ${me.color}`}>{me.initials}</div>
                          <div className="flex-1 flex gap-2">
                            <input type="text" value={commentDraft[post.id]||''}
                              onChange={e=>setCommentDraft(p=>({...p,[post.id]:e.target.value}))}
                              onKeyPress={e=>e.key==='Enter'&&submitComment(post.id)}
                              placeholder="Write a comment…"
                              className="flex-1 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none transition-all"
                              style={{ backgroundColor:'rgba(255,255,255,0.04)', border:`1px solid ${BORDER}` }}/>
                            <button onClick={()=>submitComment(post.id)}
                              className="px-3 rounded-xl text-[#C4AAF1] hover:bg-[#C4AAF1]/15 transition-all"
                              style={{ backgroundColor:'rgba(196,170,241,0.08)' }}>
                              <Send size={13}/>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
              <div className="h-10"/>
            </div>
          </main>

          {/* ════ RIGHT SIDEBAR — static, no scroll ════ */}
          <aside className="hidden xl:flex flex-col w-[255px] flex-shrink-0 py-5 gap-4 overflow-hidden">

            {/* People You May Know */}
            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor:SURF, borderColor:BORDER }}>
              <div className="px-4 py-3.5 border-b flex items-center justify-between" style={{ borderColor:BORDER }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor:'rgba(196,170,241,0.12)' }}>
                    <Sparkles size={12} className="text-[#C4AAF1]"/>
                  </div>
                  <p className="font-black text-sm">People You May Know</p>
                </div>
                <button onClick={() => setShowSuggestAll(true)} className="text-[11px] text-[#C4AAF1] font-bold hover:brightness-125 transition-all">See all</button>
              </div>
              <div className="p-2">
                {suggested.map(person=>(
                  <div key={person.id} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all group">
                    <div onClick={()=>setProfModal(person)}
                      className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-xs cursor-pointer ${person.color}`}>
                      {person.initials}
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={()=>setProfModal(person)}>
                      <p className="font-bold text-xs truncate group-hover:text-[#C4AAF1] transition-colors">{person.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{person.role}</p>
                      {person.github&&(
                        <p className="text-[9px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                          <Star size={7}/>{person.github.stars} · {person.gitActivity}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button onClick={()=>handleConnect(person.id)}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${connected.has(person.id)?'bg-emerald-500/15 text-emerald-400':pending.has(person.id)?'bg-amber-500/15 text-amber-400':''}`}
                        style={!connected.has(person.id)&&!pending.has(person.id)?{backgroundColor:'rgba(196,170,241,0.12)',color:'#C4AAF1'}:{}}
                        title="Connect">
                        {connected.has(person.id)?<Check size={12}/>:<Plus size={12}/>}
                      </button>
                      <button onClick={()=>setProfModal(person)}
                        className="w-7 h-7 rounded-xl flex items-center justify-center bg-white/[0.04] text-gray-500 hover:text-white hover:bg-white/[0.08] transition-all"
                        title="View profile">
                        <Eye size={11}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Skills */}
            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor:SURF, borderColor:BORDER }}>
              <div className="px-4 py-3.5 border-b flex items-center gap-2" style={{ borderColor:BORDER }}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor:'rgba(196,170,241,0.12)' }}>
                  <TrendingUp size={12} className="text-[#C4AAF1]"/>
                </div>
                <p className="font-black text-sm">Trending Skills</p>
              </div>
              <div className="p-2">
                {TRENDING_SKILLS.map((sk,i)=>{
                  const Icon=sk.icon;
                  return (
                    <button key={sk.name} onClick={()=>setSearchQuery(sk.name)}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-white/[0.05] transition-all group">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor:'rgba(196,170,241,0.08)' }}>
                          <Icon size={12} className="text-[#C4AAF1]"/>
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold group-hover:text-[#C4AAF1] transition-colors">{sk.name}</p>
                          <p className="text-[10px] text-gray-600">{sk.count} devs</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {sk.hot&&<Flame size={10} className="text-orange-400"/>}
                        <span className="text-[10px] text-gray-700 font-bold">#{i+1}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ════ PROFILE MODAL ════ */}
      {profModal&&(
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[80] flex items-center justify-center p-4" onClick={()=>setProfModal(null)}>
          <div className="w-full max-w-[420px] rounded-3xl border overflow-hidden shadow-2xl"
            style={{ backgroundColor:SURF, borderColor:'rgba(255,255,255,0.1)' }}
            onClick={e=>e.stopPropagation()}>
            <div className="h-24 relative" style={{ background:'linear-gradient(135deg,rgba(196,170,241,0.2),rgba(60,40,120,0.07))' }}>
              <button onClick={()=>setProfModal(null)} className="absolute top-4 right-4 w-7 h-7 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all" style={{ backgroundColor:'rgba(0,0,0,0.3)' }}><X size={14}/></button>
              <div className={`absolute -bottom-7 left-5 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg border-[3px] ${profModal.color}`} style={{ borderColor:SURF }}>{profModal.initials}</div>
            </div>
            <div className="pt-10 px-5 pb-5 overflow-y-auto max-h-[75vh]" style={{ scrollbarWidth:'thin', scrollbarColor:'rgba(196,170,241,0.2) transparent' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-black">{profModal.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${profModal.roleType==='mentor'?'bg-amber-500/15 text-amber-300 border border-amber-500/25':'bg-[#C4AAF1]/15 text-[#C4AAF1] border border-[#C4AAF1]/25'}`}>{profModal.roleType}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-gray-400 border border-white/[0.07]">{profModal.gender}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-0.5">{profModal.role}</p>
                  <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5"><MapPin size={9}/>{profModal.location}, {profModal.country}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{profModal.bio}</p>
              <div className="flex flex-wrap gap-2.5 p-3 rounded-xl border mb-4" style={{ backgroundColor:CARD, borderColor:BORDER }}>
                <div className="flex items-center gap-1.5 text-xs text-gray-400"><Zap size={10} className="text-yellow-400"/>{profModal.experience}</div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400"><Clock size={10} className="text-emerald-400"/>{profModal.availability}</div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400"><Activity size={10} className="text-[#C4AAF1]"/>{profModal.gitActivity}</div>
              </div>
              {profModal.github&&(
                <div className="rounded-xl border p-3 mb-4" style={{ backgroundColor:'rgba(0,0,0,0.3)', borderColor:BORDER }}>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2"><Github size={13} className="text-gray-400"/><span className="text-xs font-bold">@{profModal.github.username}</span></div>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"><Activity size={9}/>{profModal.github.streak}d streak</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2.5">
                    {[{icon:<GitFork size={11} className="text-[#C4AAF1]"/>,v:profModal.github.repos,l:'Repos'},{icon:<Star size={11} className="text-yellow-400"/>,v:profModal.github.stars,l:'Stars'},{icon:<Users size={11} className="text-sky-400"/>,v:profModal.github.followers,l:'Followers'}].map(s=>(
                      <div key={s.l} className="rounded-lg p-2 text-center" style={{ backgroundColor:'rgba(255,255,255,0.04)' }}>
                        <div className="flex justify-center mb-0.5">{s.icon}</div>
                        <p className="font-black text-sm">{s.v}</p>
                        <p className="text-[9px] text-gray-600">{s.l}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {profModal.github.topLanguages.map(l=><span key={l} className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#C4AAF1]/10 text-[#C4AAF1] font-medium">{l}</span>)}
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">{profModal.github.contributions} contributions</span>
                  </div>
                </div>
              )}
              <div className="mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {profModal.skills.map(s=><span key={s} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor:'rgba(196,170,241,0.1)', border:'1px solid rgba(196,170,241,0.18)', color:'#C4AAF1' }}>{s}</span>)}
                </div>
              </div>
              <div className="mb-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Looking For</p>
                <div className="flex flex-wrap gap-1.5">
                  {profModal.lookingFor.map(g=><span key={g} className="text-xs px-2.5 py-1 rounded-full text-gray-300" style={{ backgroundColor:'rgba(255,255,255,0.04)', border:`1px solid ${BORDER}` }}>{g}</span>)}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>handleConnect(profModal.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${connected.has(profModal.id)?'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25':pending.has(profModal.id)?'bg-amber-500/15 text-amber-400 border border-amber-500/25':''}`}
                  style={!connected.has(profModal.id)&&!pending.has(profModal.id)?{backgroundColor:'#C4AAF1',color:'#0d0d1a'}:{}}>
                  {connected.has(profModal.id)?<><Check size={14}/>Connected</>:pending.has(profModal.id)?'Pending…':<><UserPlus size={14}/>Connect</>}
                </button>
                {amOwner&&(
                  <button onClick={()=>{setAddTeamFor(profModal);setProfModal(null);}}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-[#C4AAF1] hover:bg-[#C4AAF1]/10 transition-all"
                    style={{ border:'1px solid rgba(196,170,241,0.3)' }}>
                    <Users size={14}/>Add to Team
                  </button>
                )}
              </div>
              
              <a href={`/profile/${profModal.id}`} className="mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-gray-300 hover:text-white hover:bg-white/[0.08] transition-all border" style={{ backgroundColor:'rgba(255,255,255,0.03)', borderColor:BORDER }}>
                View Complete Profile
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ════ SUGGEST ALL MODAL ════ */}
      {showSuggestAll&&(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[90] flex items-center justify-center p-4" onClick={()=>setShowSuggestAll(false)}>
          <div className="w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl border shadow-2xl" style={{ backgroundColor:SURF, borderColor:'rgba(255,255,255,0.1)' }} onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b" style={{ borderColor:BORDER }}>
              <div>
                <h3 className="text-lg font-black">People You May Know</h3>
                <p className="text-gray-500 text-sm mt-0.5">Grow your network</p>
              </div>
              <button onClick={()=>setShowSuggestAll(false)} className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/[0.05] text-gray-400 hover:text-white transition-all"><X size={16}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-2" style={{ scrollbarWidth:'thin', scrollbarColor:'rgba(196,170,241,0.2) transparent' }}>
              {ALL_PEOPLE.filter(p => p.id !== ME_ID && !connected.has(p.id)).map(person => (
                 <div key={person.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.02] transition-all group">
                    <div onClick={()=>{setProfModal(person); setShowSuggestAll(false);}}
                      className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm cursor-pointer ${person.color}`}>
                      {person.initials}
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={()=>{setProfModal(person); setShowSuggestAll(false);}}>
                      <p className="font-bold text-sm truncate group-hover:text-[#C4AAF1] transition-colors">{person.name}</p>
                      <p className="text-xs text-gray-500 truncate">{person.role} · {person.location}</p>
                      {person.github&&(
                        <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-1">
                          <Star size={9}/>{person.github.stars} · {person.gitActivity}
                        </p>
                      )}
                    </div>
                    <button onClick={()=>handleConnect(person.id)}
                      className={`h-8 px-3 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${pending.has(person.id)?'bg-amber-500/15 text-amber-400':''}`}
                      style={!pending.has(person.id)?{backgroundColor:'rgba(196,170,241,0.12)',color:'#C4AAF1'}:{}}>
                      {pending.has(person.id)?'Pending':<><Plus size={12} className="mr-1"/>Connect</>}
                    </button>
                 </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════ ADD TO TEAM ════ */}
      {addTeamFor&&(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[90] flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl border p-6 shadow-2xl" style={{ backgroundColor:SURF, borderColor:'rgba(255,255,255,0.1)' }}>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-lg font-black">Add to Team</h3>
                <p className="text-gray-500 text-sm mt-0.5">Adding <span className="text-white font-bold">{addTeamFor.name}</span></p>
              </div>
              <button onClick={()=>setAddTeamFor(null)} className="text-gray-500 hover:text-white transition-all"><X size={18}/></button>
            </div>
            <div className="space-y-2">
              {myOwnedTeams.map(team=>{
                const isMember=team.members.includes(addTeamFor.id);
                const isFull=team.members.length>=team.maxMembers;
                return (
                  <button key={team.id}
                    onClick={()=>!isMember&&!isFull&&handleAddToTeam(addTeamFor,team.id)}
                    disabled={isMember||isFull}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${isMember?'border-emerald-500/20 bg-emerald-500/5 opacity-60 cursor-not-allowed':isFull?'border-white/[0.05] opacity-30 cursor-not-allowed':'border-white/[0.08] hover:border-[#C4AAF1]/40 hover:bg-[#C4AAF1]/5 cursor-pointer'}`}>
                    <div>
                      <p className="font-bold text-sm">{team.name}</p>
                      <p className="text-gray-500 text-xs">{team.members.length}/{team.maxMembers} members</p>
                    </div>
                    {isMember?<span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><Check size={11}/>Member</span>
                      :isFull?<span className="text-xs text-gray-500 font-bold">Full</span>
                      :<span className="text-xs text-[#C4AAF1] font-bold flex items-center gap-1"><Plus size={11}/>Add</span>}
                  </button>
                );
              })}
            </div>
            <button onClick={()=>setAddTeamFor(null)} className="w-full mt-4 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/[0.04] transition-all" style={{ border:`1px solid ${BORDER}` }}>Cancel</button>
          </div>
        </div>
      )}

      {/* ════ SHARE TO CONNECTIONS MODAL ════ */}
      {shareConnectionsPostId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] flex items-center justify-center p-4" onClick={()=>setShareConnectionsPostId(null)}>
          <div className="w-full max-w-sm rounded-3xl border shadow-2xl flex flex-col max-h-[85vh]" style={{ backgroundColor:SURF, borderColor:'rgba(255,255,255,0.1)' }} onClick={e=>e.stopPropagation()}>
             <div className="flex justify-between items-center p-5 border-b" style={{ borderColor:BORDER }}>
                <h3 className="text-lg font-black tracking-tight">Share to Connections</h3>
                <button onClick={()=>setShareConnectionsPostId(null)} className="text-gray-500 hover:text-white transition-all"><X size={16}/></button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {ALL_PEOPLE.filter(p=>connected.has(p.id)).map(person=>(
                  <div key={person.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.02] border transition-all" style={{borderColor:BORDER}}>
                    <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm ${person.color}`}>
                      {person.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{person.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{person.role}</p>
                    </div>
                    <button onClick={()=>{
                      const msgs = JSON.parse(localStorage.getItem('scout_messages') || '[]');
                      msgs.push({ id: String(Date.now()), targetId: person.id, senderId: ME_ID, type: 'post_share', postId: shareConnectionsPostId, time: new Date().toISOString() });
                      localStorage.setItem('scout_messages', JSON.stringify(msgs));
                      safeSetPosts(p=>p.map(x=>x.id===shareConnectionsPostId?{...x,shares:x.shares+1}:x));
                      fire(`Post shared to ${person.name}!`);
                      setShareConnectionsPostId(null);
                    }} className="px-4 py-2 rounded-xl text-xs font-bold text-[#0d0d1a] bg-[#C4AAF1] hover:brightness-110 transition-all shadow-sm">Send</button>
                  </div>
                ))}
                {ALL_PEOPLE.filter(p=>connected.has(p.id)).length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-4">You have no connections to share with.</p>
                )}
             </div>
          </div>
        </div>
      )}

      {/* Mobile nav */}
      <nav className="flex-shrink-0 border-t lg:hidden flex" style={{ backgroundColor:BG, borderColor:BORDER }}>
        {[{ic:<Flame size={18}/>,l:'Feed'},{ic:<Search size={18}/>,l:'Search'},{ic:<Users size={18}/>,l:'Teams'},{ic:<UserPlus size={18}/>,l:'People'}].map((item,i)=>(
          <button key={item.l} className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-bold transition-all ${i===0?'text-[#C4AAF1]':'text-gray-600 hover:text-gray-300'}`}>
            {item.ic}{item.l}
          </button>
        ))}
      </nav>

      <style jsx global>{`
        .fl-label { display:block; font-size:10px; font-weight:800; letter-spacing:.07em; text-transform:uppercase; color:#6b7280; margin-bottom:6px; }
        * { scrollbar-width:thin; scrollbar-color:rgba(196,170,241,0.12) transparent; }
        *::-webkit-scrollbar { width:3px; height:3px; }
        *::-webkit-scrollbar-track { background:transparent; }
        *::-webkit-scrollbar-thumb { background:rgba(196,170,241,0.18); border-radius:4px; }
        *::-webkit-scrollbar-thumb:hover { background:rgba(196,170,241,0.35); }
        mark { background:rgba(139,92,246,0.22); color:#c4b5fd; border-radius:3px; padding:0 2px; }
      `}</style>
    </div>
  );
}