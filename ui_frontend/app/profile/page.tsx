"use client";

import { useState } from "react";
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
} from "lucide-react";

type TabType = "about" | "portfolio" | "activity";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("about");

  return (
    <div className="min-h-screen bg-bgcolor px-4 py-10 relative overflow-hidden">
      {/* Background blobs (same as setup page) */}
      <div className="bg-blob w-72 h-72 bg-highlightcolor top-[-80px] left-[-80px] animate-float" />
      <div
        className="bg-blob w-56 h-56 bg-blue-500 bottom-[-60px] right-[-60px] animate-float"
        style={{ animationDelay: "4s" }}
      />

      <div className="max-w-4xl mx-auto relative z-10 space-y-6">
        {/* ================= PROFILE HEADER CARD ================= */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
          {/* Cover */}
          <div className="h-36 bg-gradient-to-r from-highlightcolor/40 to-purple-500/20" />

          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="-mt-14 flex items-end justify-between">
              <div className="flex items-end gap-4">
                <div className="w-28 h-28 rounded-full border-4 border-bgcolor bg-white/10 flex items-center justify-center text-3xl font-bold text-highlightcolor">
                  P
                </div>

                <div className="pb-3">
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    pragathy
                  </h1>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-highlightcolor/20 text-highlightcolor border border-highlightcolor/40">
                      Student
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                      Available
                    </span>
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-2 text-sm px-4 py-2 border border-white/15 rounded-xl hover:border-highlightcolor/40 hover:text-highlightcolor transition-all duration-200">
                <Edit size={15} />
                Edit
              </button>
            </div>

            {/* Info Row */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60 mt-4">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} />
                Thiruvananthapuram
              </div>
              <div className="flex items-center gap-1.5">
                <Mail size={14} />
                alex.johnson@example.com
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                Joined Nov 2024
              </div>
            </div>

            {/* Bio */}
            <p className="text-white/70 text-sm mt-4 leading-relaxed max-w-3xl">
              Full-stack developer passionate about building accessible,
              performant web applications. Currently exploring AI/ML
              integrations and open-source contributions.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 text-center mt-6 pt-6 border-t border-white/10">
              <div>
                <div className="text-2xl font-bold text-highlightcolor">
                  12
                </div>
                <div className="text-xs text-white/50">Posts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">
                  3
                </div>
                <div className="text-xs text-white/50">Teams</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-400">
                  48
                </div>
                <div className="text-xs text-white/50">Connections</div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= TABS ================= */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-1 flex">
          {[
            { key: "about", label: "About" },
            { key: "portfolio", label: "Portfolio" },
            { key: "activity", label: "Activity" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-white/5 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= TAB CONTENT ================= */}
        {activeTab === "about" && (
          <div className="space-y-6">
            {/* Skills */}
            <Section title="Skills" icon={<Code size={16} />}>
              <div className="flex flex-wrap gap-2">
                {["React", "Python", "Next.js"].map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-3 py-1.5 rounded-lg bg-highlightcolor/20 border border-highlightcolor/40 text-highlightcolor"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Section>

            {/* Links */}
            <Section title="Links" icon={<Globe size={16} />}>
              <div className="space-y-3 text-sm">
                <LinkItem icon={<Github size={14} />} text="github.com/alexjohnson" />
                <LinkItem icon={<Linkedin size={14} />} text="linkedin.com/in/alexjohnson" />
                <LinkItem icon={<Globe size={14} />} text="alexjohnson.dev" />
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
                    className="text-xs px-3 py-1.5 rounded-lg border border-orange-400/40 bg-orange-400/10 text-orange-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Section>
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="space-y-4">
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
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-white/80">
        {icon}
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
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-2 text-white/70 group-hover:text-highlightcolor transition-colors">
        {icon}
        {text}
      </div>
      <ExternalLink size={14} className="text-white/30 group-hover:text-highlightcolor" />
    </div>
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
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:border-highlightcolor/40 transition-all duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-white text-lg">{title}</h3>
          <p className="text-sm text-white/50 mt-1">{desc}</p>
        </div>
        <ExternalLink size={16} className="text-white/30" />
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/60"
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
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 flex justify-between items-start">
      <div>
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="text-xs text-white/50 mt-1">{desc}</p>

        <div className="flex gap-4 mt-3 text-xs text-white/40">
          <span className="flex items-center gap-1">
            <Heart size={13} /> 12
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={13} /> 4
          </span>
        </div>
      </div>

      <span className="text-xs text-white/40">{time}</span>
    </div>
  );
}