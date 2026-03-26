"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, Mail, Calendar, Edit, ExternalLink, Heart, MessageCircle,
  Briefcase, Code, Github, Linkedin, Globe, X, Plus, Camera, Check, Trash2, Link,
  Users, FileText, UserCheck, ArrowLeft, Bookmark, Share2, LogOut,
  UserMinus, BellOff, ShieldOff, Search, SlidersHorizontal, MoreHorizontal,
  Bell, Shield, ChevronDown,
} from "lucide-react";

type TabType = "about" | "portfolio" | "activity";
type EditSection = "about" | "portfolio" | "activity";
type StatPanel = "posts" | "teams" | "connections" | null;
type AvailabilityOption = "Full-time" | "Part-time" | "Weekends only" | "Contract" | "Freelance";
type ConnectionStatus = "connected" | "muted" | "blocked";

const AVAILABILITY_OPTIONS: AvailabilityOption[] = ["Full-time", "Part-time", "Weekends only", "Contract", "Freelance"];
const LOOKING_FOR_OPTIONS = ["Team for Hackathon", "Project Collaboration", "Mentor Guidance", "Co-founder", "Freelance Work", "Learning Partners", "Job Opportunities", "Open Source Contribution"];

interface CustomLink { id: string; label: string; url: string; }
interface PortfolioItem { id: string; title: string; desc: string; tags: string[]; }
interface ActivityEntry { id: string; title: string; desc: string; time: string; }
interface PostEntry { id: string; title: string; body: string; time: string; likes: number; comments: number; tag: string; }
interface TeamEntry { id: string; name: string; role: string; event: string; members: number; status: "Active" | "Completed" | "Forming"; }

interface ConnectionEntry {
  id: string; name: string; role: string; mutual: number; letter: string; color: string;
  location?: string; bio?: string; skills?: string[]; github?: string; linkedin?: string; website?: string;
  posts?: number; teams?: number; availability?: string[]; lookingFor?: string[];
  status?: ConnectionStatus;
}

interface ProfileData {
  username: string; role: string; status: string; location: string; email: string; bio: string;
  skills: string[]; github: string; linkedin: string; website: string;
  customLinks: CustomLink[]; availability: AvailabilityOption[]; lookingFor: string[];
  avatarLetter: string; avatarImage: string | null;
  portfolio: PortfolioItem[]; activity: ActivityEntry[];
  posts: PostEntry[]; teams: TeamEntry[]; connections: ConnectionEntry[];
}

const defaultProfile: ProfileData = {
  username: "pragathy", role: "Student", status: "Available",
  location: "Thiruvananthapuram", email: "alex.johnson@example.com",
  bio: "Full-stack developer passionate about building accessible, performant web applications. Currently exploring AI/ML integrations and open-source contributions.",
  skills: ["React", "Python", "Next.js"],
  github: "github.com/alexjohnson", linkedin: "linkedin.com/in/alexjohnson", website: "alexjohnson.dev",
  customLinks: [], availability: [],
  lookingFor: ["Team for Hackathon", "Project Collaboration", "Mentor Guidance"],
  avatarLetter: "P", avatarImage: null,
  portfolio: [
    { id: "p1", title: "AI Code Reviewer", desc: "GPT-powered code review tool for GitHub PRs", tags: ["React", "Python", "OpenAI"] },
    { id: "p2", title: "EcoTrack", desc: "Carbon footprint tracker with data visualizations", tags: ["Next.js", "D3.js", "PostgreSQL"] },
  ],
  activity: [
    { id: "a1", title: "Shared a project update", desc: "Working on an AI-powered code review tool...", time: "2h ago" },
    { id: "a2", title: "Joined HackMIT 2025 Team", desc: "Joined as Frontend Developer", time: "1d ago" },
  ],
  posts: [
    { id: "po1", title: "Just shipped my AI Code Reviewer! 🚀", body: "Been working on this for 3 weeks — a GPT-powered tool that reviews GitHub PRs and leaves contextual inline comments. Open source, check it out!", time: "2h ago", likes: 34, comments: 8, tag: "Project" },
    { id: "po2", title: "Hot take: TypeScript has made me a worse programmer", body: "Hear me out — when everything is strictly typed, you stop thinking about data shapes and just trust the compiler. My mental model for JS has actually degraded. Anyone else?", time: "3d ago", likes: 127, comments: 41, tag: "Discussion" },
    { id: "po3", title: "Looking for a UI/UX co-founder 👀", body: "Building a dev collaboration platform. Strong on the engineering side, need someone who can design beautiful, intuitive interfaces. DM if interested!", time: "1w ago", likes: 56, comments: 19, tag: "Opportunity" },
    { id: "po4", title: "EcoTrack hit 500 users this month", body: "Never expected a weekend hackathon project to grow like this. Carbon footprint tracking for developers — turns out people care about this stuff. 🌿", time: "2w ago", likes: 89, comments: 22, tag: "Milestone" },
    { id: "po5", title: "Resources for learning ML as a web dev", body: "Curated list of resources I used to go from zero ML knowledge to building my first model in 2 months. Fast.ai, Karpathy's videos, and Hugging Face courses are goated.", time: "3w ago", likes: 203, comments: 67, tag: "Resource" },
    { id: "po6", title: "Joined HackMIT 2025 as Frontend Dev", body: "Excited to be part of an incredible team this year! We're building something ambitious in the sustainability space. Updates incoming 👷", time: "1mo ago", likes: 44, comments: 12, tag: "Update" },
    { id: "po7", title: "My experience with open source contributions", body: "First PR merged into a 10k⭐ repo. Took 3 rejections, lots of refactoring, and a week of back-and-forth. Totally worth it.", time: "1mo ago", likes: 71, comments: 18, tag: "Experience" },
    { id: "po8", title: "Building in public: Week 1", body: "Starting a build-in-public journey for my new SaaS idea. Week 1: validated the problem with 20 user interviews, 14 confirmed the pain point.", time: "2mo ago", likes: 39, comments: 9, tag: "Build in Public" },
    { id: "po9", title: "Why I switched from Vercel to Railway", body: "Cost, simplicity, and Postgres integration out of the box. Not sponsored, just genuinely a better fit for my projects at this stage.", time: "2mo ago", likes: 55, comments: 31, tag: "Dev Tools" },
    { id: "po10", title: "Started learning Rust 🦀", body: "Day 1. It already hates me. But I'm told the pain is worth it. Following along with 'The Book'. Any tips from Rustaceans?", time: "3mo ago", likes: 88, comments: 44, tag: "Learning" },
    { id: "po11", title: "Hackathon recap: PennApps XXIV", body: "Sleep-deprived but happy. Our team built a real-time sign language interpreter using MediaPipe + React. Didn't win but got incredible feedback.", time: "3mo ago", likes: 112, comments: 27, tag: "Hackathon" },
    { id: "po12", title: "Intro post! 👋", body: "Hey everyone — I'm Pragathy, a CS student from Thiruvananthapuram passionate about web dev and AI. Looking to collaborate, learn, and build cool things. Let's connect!", time: "4mo ago", likes: 64, comments: 33, tag: "Intro" },
  ],
  teams: [
    { id: "t1", name: "HackMIT 2025", role: "Frontend Developer", event: "HackMIT 2025", members: 4, status: "Active" },
    { id: "t2", name: "EcoTrack Collective", role: "Lead Developer", event: "Independent Project", members: 3, status: "Active" },
    { id: "t3", name: "PennApps XXIV", role: "Full-Stack Dev", event: "PennApps XXIV", members: 4, status: "Completed" },
  ],
  connections: [
    { id: "c1", name: "Aditya Sharma", role: "ML Engineer @ Google", mutual: 12, letter: "A", color: "#7C6FF7", location: "Bangalore, India", bio: "ML engineer at Google working on large-scale recommendation systems. Passionate about making AI accessible and fair.", skills: ["TensorFlow", "Python", "Kubernetes", "MLOps"], github: "github.com/adityasharma", linkedin: "linkedin.com/in/adityasharma", website: "adityasharma.dev", posts: 28, teams: 2, availability: ["Full-time"], lookingFor: ["Open Source Contribution", "Mentor Guidance"] },
    { id: "c2", name: "Priya Nair", role: "Product Designer", mutual: 8, letter: "P", color: "#F7A06F", location: "Mumbai, India", bio: "Product designer crafting delightful experiences for fintech and edtech startups.", skills: ["Figma", "Prototyping", "User Research", "Design Systems"], github: "github.com/priyanair", linkedin: "linkedin.com/in/priyanair", website: "priyanair.design", posts: 15, teams: 1, availability: ["Freelance", "Contract"], lookingFor: ["Co-founder", "Project Collaboration"] },
    { id: "c3", name: "Rohan Mehta", role: "Full-Stack Dev", mutual: 15, letter: "R", color: "#6FD9F7", location: "Pune, India", bio: "Full-stack developer obsessed with developer experience.", skills: ["Node.js", "React", "PostgreSQL", "Docker"], github: "github.com/rohanmehta", linkedin: "linkedin.com/in/rohanmehta", website: "rohanmehta.io", posts: 42, teams: 4, availability: ["Part-time", "Contract"], lookingFor: ["Team for Hackathon", "Project Collaboration"] },
    { id: "c4", name: "Sneha Krishnan", role: "CS Student @ IIT", mutual: 5, letter: "S", color: "#F76F9A", location: "Chennai, India", bio: "CS undergrad at IIT Madras. Competitive programmer and aspiring systems engineer.", skills: ["C++", "Algorithms", "Systems", "Rust"], github: "github.com/snehakrishnan", linkedin: "linkedin.com/in/snehakrishnan", posts: 9, teams: 2, availability: ["Weekends only"], lookingFor: ["Team for Hackathon", "Learning Partners"] },
    { id: "c5", name: "Arjun Patel", role: "DevRel @ Vercel", mutual: 20, letter: "A", color: "#A8F76F", location: "Remote", bio: "Developer Relations at Vercel. I help developers build fast websites.", skills: ["Next.js", "Developer Relations", "Technical Writing", "Community Building"], github: "github.com/arjunpatel", linkedin: "linkedin.com/in/arjunpatel", website: "arjunpatel.com", posts: 67, teams: 3, availability: ["Part-time"], lookingFor: ["Mentor Guidance", "Open Source Contribution"] },
    { id: "c6", name: "Kavya Menon", role: "Backend Engineer", mutual: 3, letter: "K", color: "#F7E26F", location: "Hyderabad, India", bio: "Backend engineer specializing in distributed systems and high-availability infrastructure.", skills: ["Go", "Kafka", "Redis", "AWS"], github: "github.com/kavyamenon", linkedin: "linkedin.com/in/kavyamenon", posts: 18, teams: 1, availability: ["Full-time"], lookingFor: ["Project Collaboration"] },
    { id: "c7", name: "Dhruv Iyer", role: "Open Source Maintainer", mutual: 9, letter: "D", color: "#C4AAF1", location: "Kochi, India", bio: "Maintainer of several open source libraries with 10k+ GitHub stars.", skills: ["TypeScript", "Rust", "GitHub Actions", "OSS"], github: "github.com/dhruv-iyer", linkedin: "linkedin.com/in/dhruviyer", website: "dhruviyer.dev", posts: 54, teams: 2, availability: ["Weekends only", "Freelance"], lookingFor: ["Open Source Contribution", "Mentor Guidance"] },
    { id: "c8", name: "Tanya George", role: "UI/UX Designer", mutual: 7, letter: "T", color: "#F76F6F", location: "Delhi, India", bio: "UI/UX designer with a background in cognitive psychology.", skills: ["Figma", "Motion Design", "Accessibility", "CSS"], github: "github.com/tanyageorge", linkedin: "linkedin.com/in/tanyageorge", website: "tanyageorge.design", posts: 22, teams: 1, availability: ["Contract", "Freelance"], lookingFor: ["Co-founder", "Project Collaboration"] },
    { id: "c9", name: "Mihir Joshi", role: "Startup Founder", mutual: 11, letter: "M", color: "#6FF7C4", location: "Ahmedabad, India", bio: "2x founder. Currently building an AI-powered hiring platform. YC W24.", skills: ["Product", "Sales", "React", "Growth"], github: "github.com/mihirjoshi", linkedin: "linkedin.com/in/mihirjoshi", website: "mihirjoshi.com", posts: 89, teams: 5, availability: ["Part-time"], lookingFor: ["Co-founder", "Job Opportunities"] },
    { id: "c10", name: "Riya Pillai", role: "Data Scientist", mutual: 4, letter: "R", color: "#B06FF7", location: "Trivandrum, India", bio: "Data scientist at a climate tech startup using ML to model carbon emissions.", skills: ["Python", "PyTorch", "Data Viz", "SQL"], github: "github.com/riyapillai", linkedin: "linkedin.com/in/riyapillai", posts: 11, teams: 1, availability: ["Full-time"], lookingFor: ["Learning Partners", "Project Collaboration"] },
    { id: "c11", name: "Karan Nambiar", role: "Cloud Architect", mutual: 6, letter: "K", color: "#F7B36F", location: "Singapore", bio: "Cloud architect helping enterprises migrate to modern infrastructure.", skills: ["AWS", "Terraform", "GCP", "DevOps"], github: "github.com/karannambiar", linkedin: "linkedin.com/in/karannambiar", posts: 33, teams: 0, availability: ["Contract"], lookingFor: ["Mentor Guidance"] },
    { id: "c12", name: "Ananya Singh", role: "Research Intern @ MSRI", mutual: 2, letter: "A", color: "#6F9AF7", location: "Bengaluru, India", bio: "Math and CS undergrad researching distributed algorithms at MSRI.", skills: ["Algorithms", "Python", "LaTeX", "Research"], github: "github.com/ananyasingh", linkedin: "linkedin.com/in/ananyasingh", posts: 6, teams: 1, availability: ["Weekends only"], lookingFor: ["Learning Partners", "Mentor Guidance"] },
  ],
};

const TAG_COLORS: Record<string, string> = {
  "Project": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Discussion": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Opportunity": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Milestone": "bg-green-500/20 text-green-300 border-green-500/30",
  "Resource": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Update": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "Experience": "bg-teal-500/20 text-teal-300 border-teal-500/30",
  "Build in Public": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "Dev Tools": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Learning": "bg-lime-500/20 text-lime-300 border-lime-500/30",
  "Hackathon": "bg-red-500/20 text-red-300 border-red-500/30",
  "Intro": "bg-highlightcolor/20 text-highlightcolor border-highlightcolor/30",
};

const STATUS_COLORS: Record<string, string> = {
  "Active": "bg-green-500/20 text-green-400 border-green-500/30",
  "Completed": "bg-white/10 text-white/50 border-white/20",
  "Forming": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const SAMPLE_POST_TEMPLATES = [
  { title: "Working on something new...", body: "Been heads-down building lately. Can't share details yet, but excited about where this is going. Stay tuned! 🚀", tag: "Update" },
  { title: "Lessons from the last 6 months", body: "Looking back at what I've shipped, what failed, and what surprised me. Growth is rarely linear but always worth it.", tag: "Experience" },
  { title: "Open question for the community", body: "What's the most underrated skill in your field? For me it's communication — technically strong people who can explain things clearly are rare.", tag: "Discussion" },
  { title: "Just hit a milestone 🎉", body: "Grateful for everyone who has supported this journey. Celebrating the small wins, because they add up.", tag: "Milestone" },
  { title: "Resources I wish I had earlier", body: "Curating the best resources in my domain so the next person doesn't have to figure it out the hard way.", tag: "Resource" },
];

// ── Connection context menu ──────────────────────────────────────────────
function ConnectionMenu({
  conn,
  onClose,
  onRemove,
  onMute,
  onBlock,
  onViewProfile,
}: {
  conn: ConnectionEntry;
  onClose: () => void;
  onRemove: () => void;
  onMute: () => void;
  onBlock: () => void;
  onViewProfile: () => void;
}) {
  const isMuted = conn.status === "muted";
  const isBlocked = conn.status === "blocked";

  return (
    <div
      className="absolute right-0 top-10 z-50 w-52 bg-[#1e1e2f] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => { onViewProfile(); onClose(); }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/[0.05] hover:text-white transition-colors text-left"
      >
        <ExternalLink size={14} className="text-white/40" /> View Profile
      </button>
      <button
        onClick={() => { onMute(); onClose(); }}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${isMuted ? "text-blue-300 hover:bg-blue-500/10" : "text-white/70 hover:bg-white/[0.05] hover:text-white"}`}
      >
        {isMuted ? <Bell size={14} className="text-blue-400" /> : <BellOff size={14} className="text-white/40" />}
        {isMuted ? "Unmute" : "Mute notifications"}
      </button>
      <button
        onClick={() => { onBlock(); onClose(); }}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${isBlocked ? "text-orange-300 hover:bg-orange-500/10" : "text-white/70 hover:bg-white/[0.05] hover:text-white"}`}
      >
        {isBlocked ? <Shield size={14} className="text-orange-400" /> : <ShieldOff size={14} className="text-white/40" />}
        {isBlocked ? "Unblock" : "Block"}
      </button>
      <div className="border-t border-white/[0.07] mx-3" />
      <button
        onClick={() => { onRemove(); onClose(); }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
      >
        <UserMinus size={14} /> Remove connection
      </button>
    </div>
  );
}

// ── Connection profile page ──────────────────────────────────────────────
function ConnectionProfile({
  conn,
  onBack,
  onRemove,
  onMute,
  onBlock,
}: {
  conn: ConnectionEntry;
  onBack: () => void;
  onRemove: () => void;
  onMute: () => void;
  onBlock: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"about" | "posts">("about");
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isMuted = conn.status === "muted";
  const isBlocked = conn.status === "blocked";
  const postsToShow = Math.min(conn.posts ?? 3, 5);
  const times = ["2d ago", "5d ago", "1w ago", "2w ago", "1mo ago"];

  return (
    <div className="min-h-screen bg-bgcolor px-4 py-10 relative overflow-hidden">
      <div className="bg-blob w-72 h-72 bg-highlightcolor top-[-80px] left-[-80px] animate-float" />
      <div className="bg-blob w-56 h-56 bg-blue-500 bottom-[-60px] right-[-60px] animate-float" style={{ animationDelay: "4s" }} />

      <div className="max-w-4xl mx-auto relative z-10 space-y-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-white/60 hover:text-highlightcolor transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to connections
        </button>

        {/* Status badges */}
        {(isMuted || isBlocked) && (
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm ${isBlocked ? "bg-orange-500/10 border-orange-500/30 text-orange-300" : "bg-blue-500/10 border-blue-500/30 text-blue-300"}`}>
            {isBlocked ? <ShieldOff size={15} /> : <BellOff size={15} />}
            {isBlocked ? "You've blocked this person. They can't see your profile or message you." : "You've muted notifications from this person."}
          </div>
        )}

        {/* Header card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="h-36" style={{ background: `linear-gradient(135deg, ${conn.color}40 0%, ${conn.color}10 100%)` }} />
          <div className="px-6 pb-6">
            <div className="-mt-14 flex items-end justify-between">
              <div className="flex items-end gap-4">
                <div
                  className="w-28 h-28 rounded-full border-4 border-bgcolor flex items-center justify-center text-3xl font-bold"
                  style={{ backgroundColor: conn.color, color: "#1C1C2A" }}
                >
                  {conn.letter}
                </div>
                <div className="pb-3">
                  <h1 className="text-2xl sm:text-3xl font-bold">{conn.name}</h1>
                  <p className="text-sm text-white/60 mt-1">{conn.role}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs px-3 py-1 rounded-full border" style={{ backgroundColor: `${conn.color}20`, color: conn.color, borderColor: `${conn.color}40` }}>
                      Connected
                    </span>
                    {isMuted && <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">Muted</span>}
                    {isBlocked && <span className="text-xs px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">Blocked</span>}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pb-1">
                <button
                  onClick={() => onMute()}
                  title={isMuted ? "Unmute" : "Mute"}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 ${isMuted ? "bg-blue-500/20 border-blue-500/40 text-blue-400" : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/70"}`}
                >
                  {isMuted ? <Bell size={15} /> : <BellOff size={15} />}
                </button>
                <button
                  onClick={() => setShowRemoveConfirm(true)}
                  title="Remove connection"
                  className="flex items-center gap-1.5 text-sm px-3 py-2 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                  <UserMinus size={15} /> Remove
                </button>
                {/* More menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowMenu((v) => !v)}
                    className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:border-white/20 hover:text-white/70 transition-all"
                  >
                    <MoreHorizontal size={15} />
                  </button>
                  {showMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                      <div className="absolute right-0 top-11 z-50 w-44 bg-[#1e1e2f] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden"
                        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                        <button
                          onClick={() => { onBlock(); setShowMenu(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${isBlocked ? "text-orange-300 hover:bg-orange-500/10" : "text-white/70 hover:bg-white/[0.05] hover:text-white"}`}
                        >
                          {isBlocked ? <Shield size={14} className="text-orange-400" /> : <ShieldOff size={14} className="text-white/40" />}
                          {isBlocked ? "Unblock" : "Block"}
                        </button>
                        <div className="border-t border-white/[0.07] mx-3" />
                        <button
                          onClick={() => { setShowRemoveConfirm(true); setShowMenu(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                        >
                          <UserMinus size={14} /> Remove connection
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60 mt-4">
              {conn.location && <div className="flex items-center gap-1.5"><MapPin size={14} />{conn.location}</div>}
              <div className="flex items-center gap-1.5"><Users size={14} />{conn.mutual} mutual connections</div>
              <div className="flex items-center gap-1.5"><Calendar size={14} />Connected since Jan 2024</div>
            </div>

            {conn.bio && <p className="text-white/70 text-sm mt-4 leading-relaxed max-w-3xl">{conn.bio}</p>}

            <div className="grid grid-cols-3 text-center mt-6 pt-6 border-t border-white/10">
              <div>
                <div className="text-2xl font-bold" style={{ color: conn.color }}>{conn.posts ?? 0}</div>
                <div className="text-xs text-white/50">Posts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">{conn.teams ?? 0}</div>
                <div className="text-xs text-white/50">Teams</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-400">{conn.mutual}</div>
                <div className="text-xs text-white/50">Mutual</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-1 flex">
          {([{ key: "about", label: "About" }, { key: "posts", label: "Posts" }] as const).map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.key ? "bg-white/5 text-white" : "text-white/40 hover:text-white/70"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "about" && (
          <div className="space-y-6">
            {conn.skills && conn.skills.length > 0 && (
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-white/80"><Code size={16} />Skills</div>
                <div className="flex flex-wrap gap-2">
                  {conn.skills.map((skill) => (
                    <span key={skill} className="text-xs px-3 py-1.5 rounded-lg border"
                      style={{ backgroundColor: `${conn.color}15`, borderColor: `${conn.color}35`, color: conn.color }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-white/80"><Globe size={16} />Links</div>
              <div className="space-y-3 text-sm">
                {conn.github && <LinkRow icon={<Github size={14} />} text={conn.github} />}
                {conn.linkedin && <LinkRow icon={<Linkedin size={14} />} text={conn.linkedin} />}
                {conn.website && <LinkRow icon={<Globe size={14} />} text={conn.website} />}
              </div>
            </div>
            {conn.availability && conn.availability.length > 0 && (
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-white/80"><Calendar size={16} />Availability</div>
                <div className="flex flex-wrap gap-2">
                  {conn.availability.map((a) => (
                    <span key={a} className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300">{a}</span>
                  ))}
                </div>
              </div>
            )}
            {conn.lookingFor && conn.lookingFor.length > 0 && (
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-white/80"><Briefcase size={16} />Looking For</div>
                <div className="flex flex-wrap gap-2">
                  {conn.lookingFor.map((item) => (
                    <span key={item} className="text-xs px-3 py-1.5 rounded-lg border border-orange-400/40 bg-orange-400/10 text-orange-300">{item}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "posts" && (
          <div className="space-y-4">
            {Array.from({ length: postsToShow }, (_, i) => {
              const tmpl = SAMPLE_POST_TEMPLATES[i % SAMPLE_POST_TEMPLATES.length];
              return (
                <div key={i} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-200 group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${TAG_COLORS[tmpl.tag] || "bg-white/5 text-white/50 border-white/10"}`}>{tmpl.tag}</span>
                    <span className="text-xs text-white/30">{times[i]}</span>
                  </div>
                  <h3 className="font-semibold text-white text-base mb-2 group-hover:text-highlightcolor transition-colors">{tmpl.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{tmpl.body}</p>
                  <div className="flex items-center gap-6 mt-5 pt-4 border-t border-white/5">
                    <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-pink-400 transition-colors"><Heart size={14} /> {24 + i * 17}</button>
                    <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-blue-400 transition-colors"><MessageCircle size={14} /> {5 + i * 4}</button>
                    <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-highlightcolor transition-colors ml-auto"><Bookmark size={14} /></button>
                    <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-highlightcolor transition-colors"><Share2 size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Remove confirmation modal */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRemoveConfirm(false)} />
          <div className="relative w-full max-w-sm bg-[#1C1C2A] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full border-2 border-bgcolor flex items-center justify-center text-base font-bold shrink-0"
                style={{ backgroundColor: conn.color, color: "#1C1C2A" }}>{conn.letter}</div>
              <div>
                <h3 className="text-base font-semibold text-white">Remove {conn.name}?</h3>
                <p className="text-xs text-white/40 mt-0.5">They won't be notified. You can always reconnect later.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowRemoveConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all">
                Cancel
              </button>
              <button
                onClick={() => { onRemove(); setShowRemoveConfirm(false); onBack(); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all">
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════ MAIN PROFILE PAGE ════════════════════
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("about");
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editSection, setEditSection] = useState<EditSection>("about");
  const [draft, setDraft] = useState<ProfileData>(defaultProfile);
  const [newSkill, setNewSkill] = useState("");
  const [newPortfolioTag, setNewPortfolioTag] = useState<Record<string, string>>({});
  const [newCustomLink, setNewCustomLink] = useState({ label: "", url: "" });
  const [activePanel, setActivePanel] = useState<StatPanel>(null);
  const [viewingConnection, setViewingConnection] = useState<ConnectionEntry | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Connection management state
  const [connSearch, setConnSearch] = useState("");
  const [connFilter, setConnFilter] = useState<"all" | "muted" | "blocked">("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<ConnectionEntry | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const openEdit = () => {
    setDraft({ ...profile, portfolio: profile.portfolio.map((p) => ({ ...p, tags: [...p.tags] })), activity: profile.activity.map((a) => ({ ...a })), customLinks: profile.customLinks.map((l) => ({ ...l })), availability: [...profile.availability], lookingFor: [...profile.lookingFor] });
    setIsEditing(true);
  };
  const saveEdit = () => { setProfile({ ...draft }); setIsEditing(false); };
  const cancelEdit = () => setIsEditing(false);
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setDraft((d) => ({ ...d, avatarImage: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  // Connection actions
  const removeConnection = (id: string) => {
    setProfile((p) => ({ ...p, connections: p.connections.filter((c) => c.id !== id) }));
    if (viewingConnection?.id === id) setViewingConnection(null);
  };
  const toggleMute = (id: string) => {
    setProfile((p) => ({
      ...p,
      connections: p.connections.map((c) =>
        c.id === id ? { ...c, status: c.status === "muted" ? "connected" : "muted" } : c
      ),
    }));
    if (viewingConnection?.id === id) {
      setViewingConnection((v) => v ? { ...v, status: v.status === "muted" ? "connected" : "muted" } : v);
    }
  };
  const toggleBlock = (id: string) => {
    setProfile((p) => ({
      ...p,
      connections: p.connections.map((c) =>
        c.id === id ? { ...c, status: c.status === "blocked" ? "connected" : "blocked" } : c
      ),
    }));
    if (viewingConnection?.id === id) {
      setViewingConnection((v) => v ? { ...v, status: v.status === "blocked" ? "connected" : "blocked" } : v);
    }
  };

  const addSkill = () => { const s = newSkill.trim(); if (s && !draft.skills.includes(s)) setDraft((d) => ({ ...d, skills: [...d.skills, s] })); setNewSkill(""); };
  const removeSkill = (skill: string) => setDraft((d) => ({ ...d, skills: d.skills.filter((s) => s !== skill) }));
  const toggleAvailability = (option: AvailabilityOption) => setDraft((d) => ({ ...d, availability: d.availability.includes(option) ? d.availability.filter((a) => a !== option) : [...d.availability, option] }));
  const toggleLookingFor = (item: string) => setDraft((d) => ({ ...d, lookingFor: d.lookingFor.includes(item) ? d.lookingFor.filter((i) => i !== item) : [...d.lookingFor, item] }));
  const addCustomLink = () => { const label = newCustomLink.label.trim(); const url = newCustomLink.url.trim(); if (!label || !url) return; setDraft((d) => ({ ...d, customLinks: [...d.customLinks, { id: `cl${Date.now()}`, label, url }] })); setNewCustomLink({ label: "", url: "" }); };
  const removeCustomLink = (id: string) => setDraft((d) => ({ ...d, customLinks: d.customLinks.filter((l) => l.id !== id) }));
  const updatePortfolio = (id: string, field: keyof PortfolioItem, value: string) => setDraft((d) => ({ ...d, portfolio: d.portfolio.map((p) => p.id === id ? { ...p, [field]: value } : p) }));
  const addPortfolioTag = (id: string) => { const tag = (newPortfolioTag[id] || "").trim(); if (!tag) return; setDraft((d) => ({ ...d, portfolio: d.portfolio.map((p) => p.id === id && !p.tags.includes(tag) ? { ...p, tags: [...p.tags, tag] } : p) })); setNewPortfolioTag((t) => ({ ...t, [id]: "" })); };
  const removePortfolioTag = (id: string, tag: string) => setDraft((d) => ({ ...d, portfolio: d.portfolio.map((p) => p.id === id ? { ...p, tags: p.tags.filter((t) => t !== tag) } : p) }));
  const addPortfolioItem = () => setDraft((d) => ({ ...d, portfolio: [...d.portfolio, { id: `p${Date.now()}`, title: "", desc: "", tags: [] }] }));
  const removePortfolioItem = (id: string) => setDraft((d) => ({ ...d, portfolio: d.portfolio.filter((p) => p.id !== id) }));
  const updateActivity = (id: string, field: keyof ActivityEntry, value: string) => setDraft((d) => ({ ...d, activity: d.activity.map((a) => a.id === id ? { ...a, [field]: value } : a) }));
  const addActivityItem = () => setDraft((d) => ({ ...d, activity: [{ id: `a${Date.now()}`, title: "", desc: "", time: "just now" }, ...d.activity] }));
  const removeActivityItem = (id: string) => setDraft((d) => ({ ...d, activity: d.activity.filter((a) => a.id !== id) }));

  // Derived connections list
  const filteredConnections = profile.connections.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(connSearch.toLowerCase()) || c.role.toLowerCase().includes(connSearch.toLowerCase());
    const matchesFilter = connFilter === "all" || c.status === connFilter;
    return matchesSearch && matchesFilter;
  });

  const connCounts = {
    all: profile.connections.length,
    muted: profile.connections.filter((c) => c.status === "muted").length,
    blocked: profile.connections.filter((c) => c.status === "blocked").length,
  };

  if (viewingConnection) {
    const liveConn = profile.connections.find((c) => c.id === viewingConnection.id);
    if (!liveConn) { setViewingConnection(null); return null; }
    return (
      <ConnectionProfile
        conn={liveConn}
        onBack={() => setViewingConnection(null)}
        onRemove={() => removeConnection(liveConn.id)}
        onMute={() => toggleMute(liveConn.id)}
        onBlock={() => toggleBlock(liveConn.id)}
      />
    );
  }

  if (activePanel) {
    return (
      <div className="min-h-screen bg-bgcolor px-4 py-10 relative overflow-hidden">
        <div className="bg-blob w-72 h-72 bg-highlightcolor top-[-80px] left-[-80px] animate-float" />
        <div className="bg-blob w-56 h-56 bg-blue-500 bottom-[-60px] right-[-60px] animate-float" style={{ animationDelay: "4s" }} />
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <button onClick={() => setActivePanel(null)} className="flex items-center gap-2 text-sm text-white/60 hover:text-highlightcolor transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back to profile
          </button>

          <div className="bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-5 flex items-center gap-3">
            {activePanel === "posts" && <FileText size={20} className="text-highlightcolor" />}
            {activePanel === "teams" && <Users size={20} className="text-orange-400" />}
            {activePanel === "connections" && <UserCheck size={20} className="text-pink-400" />}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">
                {activePanel === "posts" && `${profile.posts.length} Posts`}
                {activePanel === "teams" && `${profile.teams.length} Teams`}
                {activePanel === "connections" && `${profile.connections.length} Connections`}
              </h2>
              <p className="text-sm text-white/40 mt-0.5">
                {activePanel === "posts" && `Everything ${profile.username} has shared`}
                {activePanel === "teams" && `Teams ${profile.username} is part of`}
                {activePanel === "connections" && `People ${profile.username} is connected with`}
              </p>
            </div>
          </div>

          {/* POSTS */}
          {activePanel === "posts" && (
            <div className="space-y-4">
              {profile.posts.map((post) => (
                <div key={post.id} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:border-highlightcolor/30 transition-all duration-200 group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${TAG_COLORS[post.tag] || "bg-white/5 text-white/50 border-white/10"}`}>{post.tag}</span>
                    <span className="text-xs text-white/30">{post.time}</span>
                  </div>
                  <h3 className="font-semibold text-white text-base leading-snug mb-2 group-hover:text-highlightcolor transition-colors">{post.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{post.body}</p>
                  <div className="flex items-center gap-6 mt-5 pt-4 border-t border-white/5">
                    <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-pink-400 transition-colors"><Heart size={14} /> {post.likes}</button>
                    <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-blue-400 transition-colors"><MessageCircle size={14} /> {post.comments}</button>
                    <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-highlightcolor transition-colors ml-auto"><Bookmark size={14} /></button>
                    <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-highlightcolor transition-colors"><Share2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TEAMS */}
          {activePanel === "teams" && (
            <div className="space-y-4">
              {profile.teams.map((team) => (
                <div key={team.id} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:border-orange-400/30 transition-all duration-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-white text-lg">{team.name}</h3>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${STATUS_COLORS[team.status]}`}>{team.status}</span>
                      </div>
                      <p className="text-sm text-highlightcolor font-medium">{team.role}</p>
                      <p className="text-xs text-white/40 mt-1">{team.event}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-white/50 shrink-0"><Users size={14} />{team.members} members</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── CONNECTIONS with full management ── */}
          {activePanel === "connections" && (
            <div className="space-y-4">
              {/* Search + filter bar */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5">
                  <Search size={14} className="text-white/30 shrink-0" />
                  <input
                    value={connSearch}
                    onChange={(e) => setConnSearch(e.target.value)}
                    placeholder="Search connections..."
                    className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
                  />
                  {connSearch && (
                    <button onClick={() => setConnSearch("")} className="text-white/30 hover:text-white transition-colors shrink-0"><X size={13} /></button>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowFilterMenu((v) => !v)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all ${connFilter !== "all" ? "bg-highlightcolor/20 border-highlightcolor/40 text-highlightcolor" : "bg-white/[0.05] border-white/[0.08] text-white/60 hover:border-white/20 hover:text-white/80"}`}
                  >
                    <SlidersHorizontal size={14} />
                    {connFilter === "all" ? "All" : connFilter.charAt(0).toUpperCase() + connFilter.slice(1)}
                    <ChevronDown size={12} />
                  </button>
                  {showFilterMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowFilterMenu(false)} />
                      <div className="absolute right-0 top-11 z-50 w-44 bg-[#1e1e2f] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden"
                        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                        {([["all", "All connections"], ["muted", "Muted"], ["blocked", "Blocked"]] as const).map(([key, label]) => (
                          <button
                            key={key}
                            onClick={() => { setConnFilter(key); setShowFilterMenu(false); }}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left ${connFilter === key ? "text-highlightcolor bg-highlightcolor/10" : "text-white/70 hover:bg-white/[0.05] hover:text-white"}`}
                          >
                            <span>{label}</span>
                            <span className="text-xs text-white/30">{connCounts[key]}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Summary pills */}
              {connFilter === "all" && (connCounts.muted > 0 || connCounts.blocked > 0) && (
                <div className="flex gap-2 flex-wrap">
                  {connCounts.muted > 0 && (
                    <button onClick={() => setConnFilter("muted")} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 hover:bg-blue-500/25 transition-colors">
                      <BellOff size={11} /> {connCounts.muted} muted
                    </button>
                  )}
                  {connCounts.blocked > 0 && (
                    <button onClick={() => setConnFilter("blocked")} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-300 hover:bg-orange-500/25 transition-colors">
                      <ShieldOff size={11} /> {connCounts.blocked} blocked
                    </button>
                  )}
                </div>
              )}

              {/* Results count */}
              {(connSearch || connFilter !== "all") && (
                <p className="text-xs text-white/30">
                  {filteredConnections.length} result{filteredConnections.length !== 1 ? "s" : ""} {connSearch ? `for "${connSearch}"` : ""} {connFilter !== "all" ? `· ${connFilter}` : ""}
                </p>
              )}

              {/* Connection cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredConnections.map((conn) => (
                  <div key={conn.id} className="relative bg-white/[0.04] border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/[0.06] transition-all duration-200 group">
                    {/* Avatar */}
                    <button
                      onClick={() => setViewingConnection(conn)}
                      className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: conn.color, color: "#1C1C2A" }}
                    >
                      {conn.letter}
                    </button>

                    {/* Info */}
                    <button
                      onClick={() => setViewingConnection(conn)}
                      className="flex-1 min-w-0 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white truncate hover:text-highlightcolor transition-colors">{conn.name}</p>
                        {conn.status === "muted" && <BellOff size={11} className="text-blue-400 shrink-0" title="Muted" />}
                        {conn.status === "blocked" && <ShieldOff size={11} className="text-orange-400 shrink-0" title="Blocked" />}
                      </div>
                      <p className="text-xs text-white/40 truncate mt-0.5">{conn.role}</p>
                      {conn.mutual > 0 && <p className="text-xs text-white/25 mt-0.5">{conn.mutual} mutual</p>}
                    </button>

                    {/* Context menu trigger */}
                    <div className="relative shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === conn.id ? null : conn.id); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.07] transition-all"
                      >
                        <MoreHorizontal size={15} />
                      </button>
                      {openMenuId === conn.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                          <ConnectionMenu
                            conn={conn}
                            onClose={() => setOpenMenuId(null)}
                            onViewProfile={() => setViewingConnection(conn)}
                            onRemove={() => setRemoveTarget(conn)}
                            onMute={() => toggleMute(conn.id)}
                            onBlock={() => toggleBlock(conn.id)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredConnections.length === 0 && (
                <div className="text-center py-16 text-white/30 text-sm border border-dashed border-white/[0.07] rounded-2xl">
                  {connSearch ? `No connections matching "${connSearch}"` : `No ${connFilter} connections`}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Remove confirmation modal (connections panel) */}
        {removeTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRemoveTarget(null)} />
            <div className="relative w-full max-w-sm bg-[#1C1C2A] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full border-2 border-bgcolor flex items-center justify-center text-base font-bold shrink-0"
                  style={{ backgroundColor: removeTarget.color, color: "#1C1C2A" }}>{removeTarget.letter}</div>
                <div>
                  <h3 className="text-base font-semibold text-white">Remove {removeTarget.name}?</h3>
                  <p className="text-xs text-white/40 mt-0.5">They won't be notified. You can reconnect anytime.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setRemoveTarget(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all">
                  Cancel
                </button>
                <button
                  onClick={() => { removeConnection(removeTarget.id); setRemoveTarget(null); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all">
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Main profile ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bgcolor px-4 py-10 relative overflow-hidden">
      <div className="bg-blob w-72 h-72 bg-highlightcolor top-[-80px] left-[-80px] animate-float" />
      <div className="bg-blob w-56 h-56 bg-blue-500 bottom-[-60px] right-[-60px] animate-float" style={{ animationDelay: "4s" }} />
      <div className="max-w-4xl mx-auto relative z-10 space-y-6">

        <div className="flex items-center justify-end">
          <button onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 text-sm px-4 py-2 border border-white/10 rounded-xl text-white/50 hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group">
            <LogOut size={15} className="group-hover:-translate-x-0.5 transition-transform duration-200" /> Log out
          </button>
        </div>

        <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="h-36 bg-gradient-to-r from-highlightcolor/40 to-purple-500/20" />
          <div className="px-6 pb-6">
            <div className="-mt-14 flex items-end justify-between">
              <div className="flex items-end gap-4">
                <div className="w-28 h-28 rounded-full border-4 border-bgcolor bg-white/10 flex items-center justify-center text-3xl font-bold text-highlightcolor overflow-hidden">
                  {profile.avatarImage ? <img src={profile.avatarImage} alt="avatar" className="w-full h-full object-cover" /> : profile.avatarLetter}
                </div>
                <div className="pb-3">
                  <h1 className="text-2xl sm:text-3xl font-bold">{profile.username}</h1>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-highlightcolor/20 text-highlightcolor border border-highlightcolor/40">{profile.role}</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">{profile.status}</span>
                  </div>
                </div>
              </div>
              <button onClick={openEdit} className="flex items-center gap-2 text-sm px-4 py-2 border border-white/15 rounded-xl hover:border-highlightcolor/40 hover:text-highlightcolor transition-all duration-200">
                <Edit size={15} /> Edit
              </button>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60 mt-4">
              <div className="flex items-center gap-1.5"><MapPin size={14} />{profile.location}</div>
              <div className="flex items-center gap-1.5"><Mail size={14} />{profile.email}</div>
              <div className="flex items-center gap-1.5"><Calendar size={14} />Joined Nov 2024</div>
            </div>
            <p className="text-white/70 text-sm mt-4 leading-relaxed max-w-3xl">{profile.bio}</p>
            <div className="grid grid-cols-3 text-center mt-6 pt-6 border-t border-white/10">
              <button onClick={() => setActivePanel("posts")} className="group flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-white/5 transition-all duration-200">
                <div className="text-2xl font-bold text-highlightcolor group-hover:scale-110 transition-transform">{profile.posts.length}</div>
                <div className="text-xs text-white/50 group-hover:text-highlightcolor transition-colors">Posts</div>
              </button>
              <button onClick={() => setActivePanel("teams")} className="group flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-white/5 transition-all duration-200">
                <div className="text-2xl font-bold text-orange-400 group-hover:scale-110 transition-transform">{profile.teams.length}</div>
                <div className="text-xs text-white/50 group-hover:text-orange-400 transition-colors">Teams</div>
              </button>
              <button onClick={() => setActivePanel("connections")} className="group flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-white/5 transition-all duration-200">
                <div className="text-2xl font-bold text-pink-400 group-hover:scale-110 transition-transform">{profile.connections.length}</div>
                <div className="text-xs text-white/50 group-hover:text-pink-400 transition-colors">Connections</div>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-1 flex">
          {([{ key: "about", label: "About" }, { key: "portfolio", label: "Portfolio" }, { key: "activity", label: "Activity" }] as const).map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.key ? "bg-white/5 text-white" : "text-white/40 hover:text-white/70"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "about" && (
          <div className="space-y-6">
            <Section title="Skills" icon={<Code size={16} />}>
              <div className="flex flex-wrap gap-2">{profile.skills.map((skill) => (<span key={skill} className="text-xs px-3 py-1.5 rounded-lg bg-highlightcolor/20 border border-highlightcolor/40 text-highlightcolor">{skill}</span>))}</div>
            </Section>
            <Section title="Links" icon={<Globe size={16} />}>
              <div className="space-y-3 text-sm">
                <LinkRow icon={<Github size={14} />} text={profile.github} />
                <LinkRow icon={<Linkedin size={14} />} text={profile.linkedin} />
                <LinkRow icon={<Globe size={14} />} text={profile.website} />
                {profile.customLinks.map((cl) => (<LinkRow key={cl.id} icon={<Link size={14} />} text={cl.url} label={cl.label} />))}
              </div>
            </Section>
            {profile.availability.length > 0 && (
              <Section title="Availability" icon={<Calendar size={16} />}>
                <div className="flex flex-wrap gap-2">{profile.availability.map((a) => (<span key={a} className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300">{a}</span>))}</div>
              </Section>
            )}
            {profile.lookingFor.length > 0 && (
              <Section title="Looking For" icon={<Briefcase size={16} />}>
                <div className="flex flex-wrap gap-2">{profile.lookingFor.map((item) => (<span key={item} className="text-xs px-3 py-1.5 rounded-lg border border-orange-400/40 bg-orange-400/10 text-orange-300">{item}</span>))}</div>
              </Section>
            )}
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="space-y-4">
            {profile.portfolio.map((p) => (
              <div key={p.id} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:border-highlightcolor/40 transition-all duration-200">
                <div className="flex justify-between items-start">
                  <div><h3 className="font-semibold text-white text-lg">{p.title}</h3><p className="text-sm text-white/50 mt-1">{p.desc}</p></div>
                  <ExternalLink size={16} className="text-white/30" />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">{p.tags.map((tag) => (<span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/60">{tag}</span>))}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-4">
            {profile.activity.map((a) => (
              <div key={a.id} className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-semibold">{a.title}</h4>
                  <p className="text-xs text-white/50 mt-1">{a.desc}</p>
                  <div className="flex gap-4 mt-3 text-xs text-white/40">
                    <span className="flex items-center gap-1"><Heart size={13} /> 12</span>
                    <span className="flex items-center gap-1"><MessageCircle size={13} /> 4</span>
                  </div>
                </div>
                <span className="text-xs text-white/40">{a.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={cancelEdit} />
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#1C1C2A] border border-white/10 rounded-2xl shadow-2xl">
            <div className="shrink-0 border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Edit Profile</h2>
              <div className="flex items-center gap-2">
                <button onClick={saveEdit} className="flex items-center gap-1.5 text-sm px-4 py-2 bg-highlightcolor/20 border border-highlightcolor/40 text-highlightcolor rounded-xl hover:bg-highlightcolor/30 transition-all"><Check size={14} /> Save</button>
                <button onClick={cancelEdit} className="p-2 text-white/40 hover:text-white rounded-xl hover:bg-white/5 transition-all"><X size={18} /></button>
              </div>
            </div>
            <div className="shrink-0 flex gap-0 border-b border-white/10 px-6">
              {([{ key: "about", label: "About" }, { key: "portfolio", label: "Portfolio" }, { key: "activity", label: "Activity" }] as const).map((s) => (
                <button key={s.key} onClick={() => setEditSection(s.key)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${editSection === s.key ? "border-highlightcolor text-highlightcolor" : "border-transparent text-white/40 hover:text-white/70"}`}>
                  {s.label}
                </button>
              ))}
            </div>
            <div className="overflow-y-auto p-6 space-y-6">
              {editSection === "about" && <>
                <div className="flex flex-col items-center gap-2">
                  <div className="relative group w-24 h-24">
                    <div className="w-24 h-24 rounded-full border-4 border-white/10 bg-white/10 flex items-center justify-center text-3xl font-bold text-highlightcolor overflow-hidden">
                      {draft.avatarImage ? <img src={draft.avatarImage} alt="avatar" className="w-full h-full object-cover" /> : draft.avatarLetter}
                    </div>
                    <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={20} className="text-white" /></button>
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} className="text-xs text-highlightcolor/70 hover:text-highlightcolor transition-colors">Change profile picture</button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </div>
                <div className="space-y-4">
                  <SectionLabel>Basic Info</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Username"><Input value={draft.username} onChange={(v) => setDraft((d) => ({ ...d, username: v }))} placeholder="username" /></Field>
                    <Field label="Role"><Input value={draft.role} onChange={(v) => setDraft((d) => ({ ...d, role: v }))} placeholder="e.g. Student, Developer" /></Field>
                    <Field label="Status">
                      <select value={draft.status} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-highlightcolor/50 transition-colors">
                        {["Available", "Busy", "Open to Work"].map((s) => <option key={s} value={s} className="bg-[#1C1C2A]">{s}</option>)}
                      </select>
                    </Field>
                    <Field label="Location"><Input value={draft.location} onChange={(v) => setDraft((d) => ({ ...d, location: v }))} placeholder="City, Country" /></Field>
                    <Field label="Email" className="sm:col-span-2"><Input value={draft.email} onChange={(v) => setDraft((d) => ({ ...d, email: v }))} placeholder="your@email.com" /></Field>
                  </div>
                </div>
                <div className="space-y-2">
                  <SectionLabel>Bio</SectionLabel>
                  <textarea value={draft.bio} onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))} rows={3} placeholder="Tell people about yourself..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-highlightcolor/50 transition-colors resize-none" />
                </div>
                <div className="space-y-3">
                  <SectionLabel>Skills</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {draft.skills.map((skill) => (<span key={skill} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-highlightcolor/20 border border-highlightcolor/40 text-highlightcolor">{skill}<button onClick={() => removeSkill(skill)} className="hover:text-white transition-colors"><X size={11} /></button></span>))}
                  </div>
                  <TagInput value={newSkill} onChange={setNewSkill} onAdd={addSkill} placeholder="Add a skill..." accent="highlight" />
                </div>
                <div className="space-y-3">
                  <SectionLabel>Links</SectionLabel>
                  <Field label="GitHub"><IconInput icon={<Github size={14} />} value={draft.github} onChange={(v) => setDraft((d) => ({ ...d, github: v }))} placeholder="github.com/username" /></Field>
                  <Field label="LinkedIn"><IconInput icon={<Linkedin size={14} />} value={draft.linkedin} onChange={(v) => setDraft((d) => ({ ...d, linkedin: v }))} placeholder="linkedin.com/in/username" /></Field>
                  <Field label="Website"><IconInput icon={<Globe size={14} />} value={draft.website} onChange={(v) => setDraft((d) => ({ ...d, website: v }))} placeholder="yoursite.com" /></Field>
                  {draft.customLinks.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {draft.customLinks.map((cl) => (
                        <div key={cl.id} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                          <Link size={14} className="text-white/40 shrink-0" />
                          <span className="text-xs text-white/50 shrink-0">{cl.label}:</span>
                          <span className="text-sm text-white/70 flex-1 truncate">{cl.url}</span>
                          <button onClick={() => removeCustomLink(cl.id)} className="text-white/30 hover:text-red-400 transition-colors shrink-0"><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="space-y-2 pt-1">
                    <label className="text-xs text-white/40">Add Custom Link</label>
                    <div className="flex gap-2">
                      <input value={newCustomLink.label} onChange={(e) => setNewCustomLink((l) => ({ ...l, label: e.target.value }))} placeholder="Label" className="w-1/3 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-highlightcolor/50 transition-colors" />
                      <input value={newCustomLink.url} onChange={(e) => setNewCustomLink((l) => ({ ...l, url: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && addCustomLink()} placeholder="URL" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-highlightcolor/50 transition-colors" />
                      <button onClick={addCustomLink} className="p-2 bg-highlightcolor/20 border border-highlightcolor/40 text-highlightcolor rounded-xl hover:bg-highlightcolor/30 transition-all"><Plus size={16} /></button>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <SectionLabel>Availability</SectionLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABILITY_OPTIONS.map((option) => { const active = draft.availability.includes(option); return (<button key={option} onClick={() => toggleAvailability(option)} className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all duration-200 ${active ? "bg-highlightcolor/20 border-highlightcolor/50 text-highlightcolor" : "bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"}`}>{option}</button>); })}
                  </div>
                </div>
                <div className="space-y-3">
                  <SectionLabel>I'm Looking For</SectionLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {LOOKING_FOR_OPTIONS.map((option) => { const active = draft.lookingFor.includes(option); return (<button key={option} onClick={() => toggleLookingFor(option)} className={`flex items-center gap-2.5 py-2.5 px-4 rounded-xl text-xs font-medium border text-left transition-all duration-200 ${active ? "bg-orange-400/15 border-orange-400/50 text-orange-300" : "bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"}`}><div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-all ${active ? "bg-orange-400/40 border-orange-400/60" : "border-white/20"}`}>{active && <Check size={9} className="text-orange-300" />}</div>{option}</button>); })}
                  </div>
                </div>
              </>}
              {editSection === "portfolio" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <SectionLabel>Projects</SectionLabel>
                    <button onClick={addPortfolioItem} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-highlightcolor/20 border border-highlightcolor/40 text-highlightcolor rounded-xl hover:bg-highlightcolor/30 transition-all"><Plus size={13} /> Add Project</button>
                  </div>
                  {draft.portfolio.length === 0 && <div className="text-center py-12 text-white/30 text-sm border border-dashed border-white/10 rounded-2xl">No projects yet.</div>}
                  {draft.portfolio.map((p) => (
                    <div key={p.id} className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between"><span className="text-xs text-white/30 uppercase tracking-widest font-semibold">Project</span><button onClick={() => removePortfolioItem(p.id)} className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={14} /></button></div>
                      <Field label="Title"><Input value={p.title} onChange={(v) => updatePortfolio(p.id, "title", v)} placeholder="Project name" /></Field>
                      <Field label="Description"><textarea value={p.desc} onChange={(e) => updatePortfolio(p.id, "desc", e.target.value)} rows={2} placeholder="What does this project do?" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-highlightcolor/50 transition-colors resize-none" /></Field>
                      <div className="space-y-2">
                        <label className="text-xs text-white/50">Tags</label>
                        <div className="flex flex-wrap gap-2 mb-2">{p.tags.map((tag) => (<span key={tag} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/60">{tag}<button onClick={() => removePortfolioTag(p.id, tag)} className="hover:text-white transition-colors"><X size={10} /></button></span>))}</div>
                        <div className="flex gap-2">
                          <input value={newPortfolioTag[p.id] || ""} onChange={(e) => setNewPortfolioTag((t) => ({ ...t, [p.id]: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && addPortfolioTag(p.id)} placeholder="Add tag..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-highlightcolor/50 transition-colors" />
                          <button onClick={() => addPortfolioTag(p.id)} className="p-2 bg-highlightcolor/20 border border-highlightcolor/40 text-highlightcolor rounded-xl hover:bg-highlightcolor/30 transition-all"><Plus size={16} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {editSection === "activity" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <SectionLabel>Activity Posts</SectionLabel>
                    <button onClick={addActivityItem} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-highlightcolor/20 border border-highlightcolor/40 text-highlightcolor rounded-xl hover:bg-highlightcolor/30 transition-all"><Plus size={13} /> Add Post</button>
                  </div>
                  {draft.activity.length === 0 && <div className="text-center py-12 text-white/30 text-sm border border-dashed border-white/10 rounded-2xl">No activity yet.</div>}
                  {draft.activity.map((a) => (
                    <div key={a.id} className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between"><span className="text-xs text-white/30 uppercase tracking-widest font-semibold">Post</span><button onClick={() => removeActivityItem(a.id)} className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={14} /></button></div>
                      <Field label="Title"><Input value={a.title} onChange={(v) => updateActivity(a.id, "title", v)} placeholder="Post title" /></Field>
                      <Field label="Description"><textarea value={a.desc} onChange={(e) => updateActivity(a.id, "desc", e.target.value)} rows={2} placeholder="What's the update?" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-highlightcolor/50 transition-colors resize-none" /></Field>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative w-full max-w-sm bg-[#1C1C2A] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center shrink-0"><LogOut size={18} className="text-red-400" /></div>
              <div>
                <h3 className="text-base font-semibold text-white">Log out?</h3>
                <p className="text-xs text-white/40 mt-0.5">You'll need to sign in again to access your profile.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={() => { setShowLogoutConfirm(false); router.push("/"); }} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all">Log out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) { return <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">{children}</p>; }
function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) { return (<div className={`space-y-1.5 ${className}`}><label className="text-xs text-white/50">{label}</label>{children}</div>); }
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) { return (<input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-highlightcolor/50 transition-colors" />); }
function IconInput({ icon, value, onChange, placeholder }: { icon: React.ReactNode; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (<div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-highlightcolor/50 transition-colors"><span className="text-white/40 shrink-0">{icon}</span><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none" /></div>);
}
function TagInput({ value, onChange, onAdd, placeholder, accent }: { value: string; onChange: (v: string) => void; onAdd: () => void; placeholder: string; accent: "highlight" | "orange"; }) {
  const hl = accent === "highlight";
  return (<div className="flex gap-2"><input value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onAdd()} placeholder={placeholder} className={`flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none transition-colors ${hl ? "focus:border-highlightcolor/50" : "focus:border-orange-400/50"}`} /><button onClick={onAdd} className={`p-2 rounded-xl transition-all ${hl ? "bg-highlightcolor/20 border border-highlightcolor/40 text-highlightcolor hover:bg-highlightcolor/30" : "bg-orange-400/10 border border-orange-400/40 text-orange-300 hover:bg-orange-400/20"}`}><Plus size={16} /></button></div>);
}
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (<div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6"><div className="flex items-center gap-2 mb-4 text-sm font-semibold text-white/80">{icon}{title}</div>{children}</div>);
}
function LinkRow({ icon, text, label }: { icon: React.ReactNode; text: string; label?: string }) {
  return (<div className="flex items-center justify-between group cursor-pointer"><div className="flex items-center gap-2 text-white/70 group-hover:text-highlightcolor transition-colors">{icon}{label && <span className="text-white/40 text-xs">{label}:</span>}{text}</div><ExternalLink size={14} className="text-white/30 group-hover:text-highlightcolor" /></div>);
}