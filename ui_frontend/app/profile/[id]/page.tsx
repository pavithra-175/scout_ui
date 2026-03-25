"use client";

import { useState, use } from "react";
import {
    MapPin,
    Mail,
    Calendar,
    Edit,
    ExternalLink,
    Heart,
    MessageCircle,
    Briefcase,
    Code,
    Github,
    Linkedin,
    Globe,
    ArrowLeft,
} from "lucide-react";
import Link from "next/link";

type TabType = "about" | "portfolio" | "activity";

const SUGGESTED_PEOPLE = [
    { id: 'p1', name: 'Raj Kumar', initials: 'RK', color: 'bg-orange-500/20 text-orange-300', role: 'ML Engineer', skills: ['Python', 'TensorFlow', 'AI'], gitActivity: '47 commits/mo', location: 'Bangalore' },
    { id: 'p2', name: 'Ananya S.', initials: 'AS', color: 'bg-pink-500/20 text-pink-300', role: 'React Developer', skills: ['React', 'TypeScript', 'SaaS'], gitActivity: '62 commits/mo', location: 'Mumbai' },
    { id: 'p3', name: 'Dev Patel', initials: 'DP', color: 'bg-blue-500/20 text-blue-300', role: 'Full-stack', skills: ['Node.js', 'React', 'ML'], gitActivity: '38 commits/mo', location: 'Pune' },
    { id: 'p4', name: 'Sara Chen', initials: 'SC', color: 'bg-green-500/20 text-green-300', role: 'Data Scientist', skills: ['Python', 'DataScience', 'AI'], gitActivity: '29 commits/mo', location: 'Hyderabad' },
    { id: 'p5', name: 'Marco R.', initials: 'MR', color: 'bg-purple-500/20 text-purple-300', role: 'DevOps', skills: ['DevOps', 'Node.js', 'TypeScript'], gitActivity: '55 commits/mo', location: 'Chennai' },
];

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [activeTab, setActiveTab] = useState<TabType>("about");

    const isMe = id === 'me' || id === 'my';

    // Find person if not me
    const person = SUGGESTED_PEOPLE.find(p => p.id === id);

    // Default data (Me)
    const userData = isMe ? {
        name: "pragathy",
        initials: "P",
        role: "Student",
        location: "Thiruvananthapuram",
        email: "alex.johnson@example.com",
        joined: "Nov 2024",
        bio: "Full-stack developer passionate about building accessible, performant web applications. Currently exploring AI/ML integrations and open-source contributions.",
        skills: ["React", "Python", "Next.js"],
        color: "bg-white/10 text-highlightcolor",
        teams: 3,
        connections: 48,
        posts: 12
    } : person ? {
        name: person.name,
        initials: person.initials,
        role: person.role,
        location: person.location,
        email: `${person.name.toLowerCase().replace(' ', '.')}@example.com`,
        joined: "Jan 2025",
        bio: `${person.role} with a focus on ${person.skills.join(', ')}. Active contributor on GitHub with ${person.gitActivity}.`,
        skills: person.skills,
        color: person.color,
        teams: 1,
        connections: 12,
        posts: 4
    } : null;

    if (!userData) {
        return (
            <div className="min-h-screen bg-bgcolor flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
                <Link href="/team" className="text-highlightcolor flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Teams
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bgcolor px-4 py-10 relative overflow-hidden">
            {/* Background blobs */}
            <div className="bg-blob w-72 h-72 bg-highlightcolor top-[-80px] left-[-80px] animate-float opacity-20 blur-3xl" />
            <div
                className="bg-blob w-56 h-56 bg-blue-500 bottom-[-60px] right-[-60px] animate-float opacity-10 blur-3xl"
                style={{ animationDelay: "4s" }}
            />

            <div className="max-w-4xl mx-auto relative z-10 space-y-6">
                {/* Navigation */}
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/team" className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all">
                        <ArrowLeft size={20} />
                    </Link>
                    <span className="text-sm text-white/40">Profile / {userData.name}</span>
                </div>

                {/* ================= PROFILE HEADER CARD ================= */}
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
                    {/* Cover */}
                    <div className="h-36 bg-gradient-to-r from-highlightcolor/30 to-purple-500/10" />

                    <div className="px-6 pb-6">
                        {/* Avatar */}
                        <div className="-mt-14 flex items-end justify-between">
                            <div className="flex items-end gap-4">
                                <div className={`w-28 h-28 rounded-2xl border-4 border-[#1C1C2A] flex items-center justify-center text-3xl font-bold shadow-xl ${userData.color}`}>
                                    {userData.initials}
                                </div>

                                <div className="pb-3">
                                    <h1 className="text-2xl sm:text-3xl font-bold">
                                        {userData.name}
                                    </h1>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="text-xs px-3 py-1 rounded-full bg-highlightcolor/20 text-highlightcolor border border-highlightcolor/40 font-semibold">
                                            {userData.role}
                                        </span>
                                        <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 font-semibold">
                                            Available
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {isMe && (
                                <button className="flex items-center gap-2 text-sm px-4 py-2 bg-highlightcolor text-[#1C1C2A] font-bold rounded-xl hover:opacity-90 transition-all duration-200">
                                    <Edit size={15} />
                                    Edit
                                </button>
                            )}
                        </div>

                        {/* Info Row */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/50 mt-6">
                            <div className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-highlightcolor" />
                                {userData.location}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Mail size={14} className="text-highlightcolor" />
                                {userData.email}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-highlightcolor" />
                                Joined {userData.joined}
                            </div>
                        </div>

                        {/* Bio */}
                        <p className="text-white/70 text-sm mt-5 leading-relaxed max-w-3xl">
                            {userData.bio}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 text-center mt-8 pt-8 border-t border-white/10">
                            <div>
                                <div className="text-2xl font-bold text-highlightcolor">
                                    {userData.posts}
                                </div>
                                <div className="text-xs text-white/40 uppercase tracking-widest font-bold">Posts</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-orange-400">
                                    {userData.teams}
                                </div>
                                <div className="text-xs text-white/40 uppercase tracking-widest font-bold">Teams</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-pink-400">
                                    {userData.connections}
                                </div>
                                <div className="text-xs text-white/40 uppercase tracking-widest font-bold">Connections</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= TABS ================= */}
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-1 flex shadow-lg">
                    {[
                        { key: "about", label: "About" },
                        { key: "portfolio", label: "Portfolio" },
                        { key: "activity", label: "Activity" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as TabType)}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === tab.key
                                ? "bg-white/10 text-highlightcolor shadow-inner"
                                : "text-white/40 hover:text-white/70"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ================= TAB CONTENT ================= */}
                {activeTab === "about" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Skills */}
                        <Section title="Skills" icon={<Code size={16} />}>
                            <div className="flex flex-wrap gap-2">
                                {userData.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="text-xs px-3 py-2 rounded-xl bg-highlightcolor/10 border border-highlightcolor/20 text-highlightcolor font-bold"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </Section>

                        {/* Links */}
                        <Section title="Links" icon={<Globe size={16} />}>
                            <div className="space-y-4 text-sm">
                                <LinkItem icon={<Github size={16} />} text={`github.com/${userData.name.toLowerCase().replace(' ', '')}`} />
                                <LinkItem icon={<Linkedin size={16} />} text={`linkedin.com/in/${userData.name.toLowerCase().replace(' ', '')}`} />
                                <LinkItem icon={<Globe size={16} />} text={`${userData.name.toLowerCase().replace(' ', '')}.dev`} />
                            </div>
                        </Section>

                        {/* Looking For */}
                        <Section title="Looking For" icon={<Briefcase size={16} />}>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    "Team for Hackathon",
                                    "Project Collaboration",
                                    "Mentor Guidance",
                                ].map((item) => (
                                    <span
                                        key={item}
                                        className="text-xs px-3 py-2 rounded-xl border border-orange-400/20 bg-orange-400/5 text-orange-300 font-bold"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </Section>
                    </div>
                )}

                {activeTab === "portfolio" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PortfolioCard
                            title="AI Code Reviewer"
                            desc="GPT-powered code review tool for GitHub PRs"
                            tags={["React", "Python", "OpenAI"]}
                        />
                        <PortfolioCard
                            title="EcoTrack"
                            desc="Carbon footprint tracker with data visualizations"
                            tags={["Next.js", "D3.js", "PostgreSQL"]}
                        />
                    </div>
                )}

                {activeTab === "activity" && (
                    <div className="space-y-4">
                        <ActivityItem
                            title="Shared a project update"
                            desc="Working on an AI-powered code review tool..."
                            time="2h ago"
                        />
                        <ActivityItem
                            title="Joined HackMIT 2025 Team"
                            desc="Joined as Frontend Developer"
                            time="1d ago"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

/* ================= SMALL COMPONENTS ================= */

function Section({
    title,
    icon,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6 text-xs font-black text-white/40 uppercase tracking-widest">
                <span className="p-1.5 rounded-lg bg-highlightcolor/10 text-highlightcolor">{icon}</span>
                {title}
            </div>
            {children}
        </div>
    );
}

function LinkItem({
    icon,
    text,
}: {
    icon: React.ReactNode;
    text: string;
}) {
    return (
        <a href="#" className="flex items-center justify-between group p-3 rounded-xl border border-white/5 hover:border-highlightcolor/30 hover:bg-white/5 transition-all">
            <div className="flex items-center gap-3 text-white/60 group-hover:text-highlightcolor transition-colors">
                {icon}
                <span className="font-medium">{text}</span>
            </div>
            <ExternalLink size={14} className="text-white/20 group-hover:text-highlightcolor" />
        </a>
    );
}

function PortfolioCard({
    title,
    desc,
    tags,
}: {
    title: string;
    desc: string;
    tags: string[];
}) {
    return (
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:border-highlightcolor/40 transition-all duration-300 shadow-lg group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-highlightcolor transition-colors">{title}</h3>
                    <p className="text-sm text-white/40 mt-1">{desc}</p>
                </div>
                <div className="p-2 rounded-lg bg-white/5 text-white/20 group-hover:text-highlightcolor group-hover:bg-highlightcolor/10 transition-all">
                    <ExternalLink size={18} />
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/5 text-white/50 font-bold uppercase tracking-wider"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}

function ActivityItem({
    title,
    desc,
    time,
}: {
    title: string;
    desc: string;
    time: string;
}) {
    return (
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 flex justify-between items-start shadow-lg hover:border-white/20 transition-all">
            <div className="space-y-2">
                <h4 className="text-sm font-bold text-white/90">{title}</h4>
                <p className="text-xs text-white/40">{desc}</p>

                <div className="flex gap-4 mt-4 text-[10px] text-white/30 font-bold uppercase tracking-tighter">
                    <span className="flex items-center gap-1 hover:text-pink-400 transition-colors cursor-pointer">
                        <Heart size={12} /> 12
                    </span>
                    <span className="flex items-center gap-1 hover:text-highlightcolor transition-colors cursor-pointer">
                        <MessageCircle size={12} /> 4
                    </span>
                </div>
            </div>

            <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">{time}</span>
        </div>
    );
}
