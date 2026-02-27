"use client";

import React, { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, Check, Plus, X, User, Mail, MapPin, FileText, Github, Linkedin, Globe, Hash, Camera } from "lucide-react";

/* ================== TYPES ================== */
type Role = "student" | "mentor" | "";
type ExperienceLevel = "Beginner" | "Intermediate" | "Expert" | "";
type Availability = "Full-time" | "Part-time" | "Weekends only" | "Contract" | "Freelance" | "";

interface BasicInfo {
  fullName: string;
  email: string;
  age: string;
  gender: string;
  location: string;
  bio: string;
}

interface SkillsInfo {
  role: Role;
  domain: string[];
  skills: string[];
  experience: ExperienceLevel;
  availability: Availability;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface LinksGoals {
  links: SocialLink[];
  lookingFor: string[];
}

/* ================== CONSTANTS ================== */
const DOMAINS = [
  "Web Development", "Mobile", "AI/ML", "DevOps", "Cybersecurity",
  "Blockchain", "Game Dev", "Data Science", "Cloud", "IoT",
  "Embedded Systems", "UI/UX Design", "AR/VR", "Robotics", "Fintech",
];

const POPULAR_SKILLS = [
  "React", "TypeScript", "Node.js", "Python", "Java", "Go", "Rust",
  "AWS", "Docker", "Kubernetes", "Vue.js", "Angular", "Next.js", "Django",
  "FastAPI", "PostgreSQL", "MongoDB", "Redis", "GraphQL", "Tailwind CSS",
  "Flutter", "Swift", "Kotlin", "TensorFlow", "PyTorch",
];

const LOOKING_FOR_OPTIONS = [
  "Team for Hackathon", "Project Collaboration", "Mentor Guidance",
  "Co-founder", "Freelance Work", "Learning Partners", "Job Opportunities",
  "Open Source Contribution",
];

const PLATFORMS = ["GitHub", "LinkedIn", "Portfolio", "Twitter/X", "Dribbble", "Behance", "YouTube", "Dev.to"];

const AVAILABILITY_OPTIONS: Availability[] = ["Full-time", "Part-time", "Weekends only", "Contract", "Freelance"];

/* ================== STEP INDICATOR ================== */
function StepIndicator({ step }: { step: number }) {
  const steps = [
    { num: 1, label: "Basic Info" },
    { num: 2, label: "Skills & Role" },
    { num: 3, label: "Links & Goals" },
  ];

  return (
    <div className="flex items-center justify-center gap-0 mb-8 px-4">
      {steps.map((s, i) => (
        <React.Fragment key={s.num}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step > s.num
                  ? "bg-highlightcolor text-bgcolor"
                  : step === s.num
                  ? "bg-highlightcolor text-bgcolor ring-4 ring-highlightcolor/30"
                  : "bg-white/10 text-white/40"
              }`}
            >
              {step > s.num ? <Check size={16} /> : s.num}
            </div>
            <span className={`text-xs hidden sm:block font-medium transition-colors duration-300 ${step >= s.num ? "text-highlightcolor" : "text-white/30"}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-16 sm:w-24 md:w-32 mx-2 transition-all duration-500 ${step > s.num + 0 ? "bg-highlightcolor" : "bg-white/10"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ================== INPUT COMPONENT ================== */
function Input({
  icon: Icon,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  icon?: React.ElementType;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="relative">
      {Icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
          <Icon size={16} />
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-4 text-white placeholder-white/25 text-sm focus:outline-none focus:border-highlightcolor/60 focus:bg-white/8 transition-all duration-200 ${Icon ? "pl-10" : "pl-4"}`}
      />
    </div>
  );
}

/* ================== SELECT COMPONENT ================== */
function Select({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-highlightcolor/60 transition-all duration-200 appearance-none"
    >
      <option value="" disabled className="bg-[#1C1C2A]">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o} className="bg-[#1C1C2A]">{o}</option>
      ))}
    </select>
  );
}

/* ================== TAG CHIP ================== */
function Tag({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-highlightcolor/20 border border-highlightcolor/40 text-highlightcolor text-xs rounded-lg px-3 py-1.5 font-medium">
      {label}
      {onRemove && (
        <button onClick={onRemove} className="ml-1 hover:text-white transition-colors">
          <X size={12} />
        </button>
      )}
    </span>
  );
}

/* ================== AVATAR UPLOAD ================== */
const RANDOM_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zara",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivy",
];

function AvatarUpload({ avatar, setAvatar }: { avatar: string; setAvatar: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [randomIdx, setRandomIdx] = useState(Math.floor(Math.random() * RANDOM_AVATARS.length));

  const currentRandom = RANDOM_AVATARS[randomIdx];
  const displaySrc = avatar || currentRandom;
  const isCustom = !!avatar;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRandomize = () => {
    setAvatar(""); // clear custom upload
    setRandomIdx((prev) => (prev + 1) % RANDOM_AVATARS.length);
  };

  return (
    <div className="flex flex-col items-center gap-3 pb-5 border-b border-white/10 mb-2">
      {/* Avatar circle */}
      <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-highlightcolor/50 ring-4 ring-highlightcolor/15 bg-white/5 flex items-center justify-center transition-all duration-300 group-hover:border-highlightcolor group-hover:ring-highlightcolor/30">
          {displaySrc ? (
            <img
              src={displaySrc}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={36} className="text-white/20" />
          )}
        </div>
        {/* Camera overlay on hover */}
        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Camera size={20} className="text-white" />
        </div>
        {/* Upload badge */}
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-highlightcolor flex items-center justify-center border-2 border-bgcolor shadow-lg">
          <Camera size={13} className="text-bgcolor" />
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => fileRef.current?.click()}
          className="text-xs px-3 py-1.5 rounded-lg border border-highlightcolor/40 text-highlightcolor hover:bg-highlightcolor/10 transition-all duration-200 font-medium"
        >
          Upload Photo
        </button>
        <span className="text-white/20 text-xs">or</span>
        <button
          onClick={handleRandomize}
          className="text-xs px-3 py-1.5 rounded-lg border border-white/15 text-white/50 hover:border-white/30 hover:text-white/80 transition-all duration-200 font-medium"
        >
          🎲 Random Avatar
        </button>
        {isCustom && (
          <button
            onClick={() => setAvatar("")}
            className="text-xs text-white/30 hover:text-red-400 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isCustom && (
        <span className="text-xs text-highlightcolor/60">Custom photo uploaded ✓</span>
      )}
    </div>
  );
}

/* ================== STEP 1: BASIC INFO ================== */
function Step1({ data, setData, avatar, setAvatar }: { data: BasicInfo; setData: (d: BasicInfo) => void; avatar: string; setAvatar: (v: string) => void }) {
  const set = (key: keyof BasicInfo) => (v: string) => setData({ ...data, [key]: v });

  return (
    <div className="space-y-5">
      <AvatarUpload avatar={avatar} setAvatar={setAvatar} />
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Tell us about yourself</h2>
        <p className="text-white/40 text-sm">Help others find and connect with you</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-white/50 font-medium uppercase tracking-wider">Full Name</label>
          <Input icon={User} placeholder="John Doe" value={data.fullName} onChange={set("fullName")} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-white/50 font-medium uppercase tracking-wider">Email</label>
          <Input icon={Mail} placeholder="you@example.com" value={data.email} onChange={set("email")} type="email" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-white/50 font-medium uppercase tracking-wider">Age</label>
          <Input placeholder="e.g. 21" value={data.age} onChange={(v) => { if (!v || Number(v) >= 0) set("age")(v); }} type="number" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-white/50 font-medium uppercase tracking-wider">Gender</label>
          <Select
            options={["Male", "Female", "Non-binary", "Prefer not to say", "Other"]}
            value={data.gender}
            onChange={set("gender")}
            placeholder="Select gender"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-white/50 font-medium uppercase tracking-wider">Location</label>
        <Input icon={MapPin} placeholder="City, Country" value={data.location} onChange={set("location")} />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-white/50 font-medium uppercase tracking-wider">Bio</label>
        <div className="relative">
          <span className="absolute left-3 top-3.5 text-white/30">
            <FileText size={16} />
          </span>
          <textarea
            placeholder="Tell us about yourself, your interests, and what you're working on..."
            value={data.bio}
            onChange={(e) => set("bio")(e.target.value)}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-4 pl-10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-highlightcolor/60 focus:bg-white/8 transition-all duration-200 resize-none"
          />
        </div>
      </div>
    </div>
  );
}

/* ================== STEP 2: SKILLS & ROLE ================== */
function Step2({ data, setData }: { data: SkillsInfo; setData: (d: SkillsInfo) => void }) {
  const [skillInput, setSkillInput] = useState("");

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !data.skills.includes(s)) {
      setData({ ...data, skills: [...data.skills, s] });
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setData({ ...data, skills: data.skills.filter((s) => s !== skill) });
  };

  const toggleDomain = (domain: string) => {
    const domains = data.domain.includes(domain)
      ? data.domain.filter((d) => d !== domain)
      : [...data.domain, domain];
    setData({ ...data, domain: domains });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">What are your skills?</h2>
        <p className="text-white/40 text-sm">Add skills and choose your role</p>
      </div>

      {/* Role */}
      <div className="space-y-2">
        <label className="text-xs text-white/50 font-medium uppercase tracking-wider">I am a</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: "student", title: "Student / Developer", sub: "Looking to join teams and learn" },
            { key: "mentor", title: "Mentor", sub: "Guide and help others grow" },
          ].map((r) => (
            <button
              key={r.key}
              onClick={() => setData({ ...data, role: r.key as Role })}
              className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                data.role === r.key
                  ? "border-highlightcolor bg-highlightcolor/15"
                  : "border-white/10 bg-white/5 hover:border-white/25"
              }`}
            >
              <div className="font-semibold text-white text-sm">{r.title}</div>
              <div className="text-white/40 text-xs mt-0.5">{r.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Domain */}
      <div className="space-y-2">
        <label className="text-xs text-white/50 font-medium uppercase tracking-wider">Domain</label>
        <div className="flex flex-wrap gap-2">
          {DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => toggleDomain(d)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 font-medium ${
                data.domain.includes(d)
                  ? "border-highlightcolor bg-highlightcolor/20 text-highlightcolor"
                  : "border-white/10 bg-white/5 text-white/50 hover:border-white/30 hover:text-white/80"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <label className="text-xs text-white/50 font-medium uppercase tracking-wider">Skills</label>
        <div className="relative">
          <input
            placeholder="Type a skill and press Enter..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill(skillInput)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-highlightcolor/60 transition-all duration-200"
          />
          <button
            onClick={() => addSkill(skillInput)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-highlightcolor transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {data.skills.map((s) => (
            <Tag key={s} label={s} onRemove={() => removeSkill(s)} />
          ))}
        </div>
        <div>
          <span className="text-xs text-white/30 mr-2">Popular:</span>
          <div className="inline-flex flex-wrap gap-1.5 mt-1">
            {POPULAR_SKILLS.filter((s) => !data.skills.includes(s)).slice(0, 15).map((s) => (
              <button
                key={s}
                onClick={() => addSkill(s)}
                className="text-xs text-white/40 hover:text-highlightcolor border border-white/10 hover:border-highlightcolor/40 rounded-lg px-2.5 py-1 transition-all duration-150"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="space-y-2">
        <label className="text-xs text-white/50 font-medium uppercase tracking-wider">Experience Level</label>
        <div className="grid grid-cols-3 gap-3">
          {(["Beginner", "Intermediate", "Expert"] as ExperienceLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setData({ ...data, experience: level })}
              className={`py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                data.experience === level
                  ? "border-highlightcolor bg-highlightcolor/20 text-highlightcolor"
                  : "border-white/10 bg-white/5 text-white/50 hover:border-white/25 hover:text-white/80"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-2">
        <label className="text-xs text-white/50 font-medium uppercase tracking-wider">Availability</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AVAILABILITY_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setData({ ...data, availability: opt })}
              className={`py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 ${
                data.availability === opt
                  ? "border-highlightcolor bg-highlightcolor/20 text-highlightcolor"
                  : "border-white/10 bg-white/5 text-white/50 hover:border-white/25 hover:text-white/80"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================== STEP 3: LINKS & GOALS ================== */
function Step3({ data, setData }: { data: LinksGoals; setData: (d: LinksGoals) => void }) {
  const [newPlatform, setNewPlatform] = useState("");
  const [customPlatformInput, setCustomPlatformInput] = useState("");

  const addLink = () => {
    setData({ ...data, links: [...data.links, { platform: "", url: "" }] });
  };

  const removeLink = (i: number) => {
    setData({ ...data, links: data.links.filter((_, idx) => idx !== i) });
  };

  const updateLink = (i: number, key: keyof SocialLink, value: string) => {
    const updated = data.links.map((l, idx) => idx === i ? { ...l, [key]: value } : l);
    setData({ ...data, links: updated });
  };

  const toggleGoal = (goal: string) => {
    const goals = data.lookingFor.includes(goal)
      ? data.lookingFor.filter((g) => g !== goal)
      : [...data.lookingFor, goal];
    setData({ ...data, lookingFor: goals });
  };

  const platformIcon = (p: string) => {
    if (p === "GitHub") return Github;
    if (p === "LinkedIn") return Linkedin;
    if (p === "Portfolio") return Globe;
    return Hash;
  };

  const allPlatforms = [...PLATFORMS, ...data.links.filter(l => !PLATFORMS.includes(l.platform) && l.platform).map(l => l.platform)];
  const uniquePlatforms = [...new Set(allPlatforms)];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Connect your profiles</h2>
        <p className="text-white/40 text-sm">Share your work and goals</p>
      </div>

      {/* Social Links */}
      <div className="space-y-3">
        {data.links.map((link, i) => {
          const Icon = platformIcon(link.platform);
          return (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex gap-2 flex-1 flex-col sm:flex-row">
                <div className="sm:w-40 shrink-0">
                  <Select
                    options={uniquePlatforms}
                    value={link.platform}
                    onChange={(v) => updateLink(i, "platform", v)}
                    placeholder="Select Platform"
                  />
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                    <Icon size={15} />
                  </span>
                  <input
                    placeholder="https://..."
                    value={link.url}
                    onChange={(e) => updateLink(i, "url", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-white placeholder-white/25 text-sm focus:outline-none focus:border-highlightcolor/60 transition-all duration-200"
                  />
                </div>
              </div>
              <button
                onClick={() => removeLink(i)}
                className="mt-2.5 sm:mt-0 sm:self-center text-white/20 hover:text-red-400 transition-colors p-2"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}

        {/* Add Custom Platform Section */}
        <div className="border-t border-white/10 pt-3">
          <p className="text-xs text-white/50 font-medium uppercase tracking-wider mb-3">Add Custom Platform</p>
          <div className="flex gap-2 flex-col sm:flex-row">
            <input
              placeholder="Platform name (e.g., Behance, Codepen)"
              value={customPlatformInput}
              onChange={(e) => setCustomPlatformInput(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/25 text-sm focus:outline-none focus:border-highlightcolor/60 transition-all duration-200"
            />
            <button
              onClick={() => {
                if (customPlatformInput.trim()) {
                  setData({
                    ...data,
                    links: [...data.links, { platform: customPlatformInput.trim(), url: "" }]
                  });
                  setCustomPlatformInput("");
                }
              }}
              className="bg-highlightcolor/20 border border-highlightcolor/40 text-highlightcolor text-sm font-medium px-4 py-3 rounded-xl hover:bg-highlightcolor/30 transition-all duration-200 whitespace-nowrap"
            >
              Add Platform
            </button>
          </div>
        </div>

        <button
          onClick={addLink}
          className="flex items-center gap-2 text-sm text-highlightcolor/70 hover:text-highlightcolor border border-dashed border-white/15 hover:border-highlightcolor/40 rounded-xl px-4 py-2.5 w-full justify-center transition-all duration-200"
        >
          <Plus size={15} /> Add another social link
        </button>
      </div>

      {/* Looking For */}
      <div className="space-y-2">
        <label className="text-xs text-white/50 font-medium uppercase tracking-wider">I'm looking for</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LOOKING_FOR_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => toggleGoal(opt)}
              className={`flex items-center gap-2.5 text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${
                data.lookingFor.includes(opt)
                  ? "border-highlightcolor bg-highlightcolor/15 text-white"
                  : "border-white/10 bg-white/5 text-white/50 hover:border-white/25 hover:text-white/80"
              }`}
            >
              <span className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                data.lookingFor.includes(opt) ? "bg-highlightcolor border-highlightcolor" : "border-white/25"
              }`}>
                {data.lookingFor.includes(opt) && <Check size={11} className="text-bgcolor" />}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================== MAIN PAGE ================== */
export default function ProfileSetup() {
  const [step, setStep] = useState(1);

  const [avatar, setAvatar] = useState<string>("");

  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    fullName: "", email: "", age: "", gender: "", location: "", bio: "",
  });

  const [skillsInfo, setSkillsInfo] = useState<SkillsInfo>({
    role: "", domain: [], skills: [], experience: "", availability: "",
  });

  const [linksGoals, setLinksGoals] = useState<LinksGoals>({
    links: [{ platform: "GitHub", url: "" }, { platform: "LinkedIn", url: "" }, { platform: "Portfolio", url: "" }],
    lookingFor: [],
  });

  const handleBack = () => {
    if (step === 1) {
      window.history.back();
    } else {
      setStep(step - 1);
    }
  };

  const handleContinue = () => {
    if (step < 3) setStep(step + 1);
    else {
      console.log({ basicInfo, skillsInfo, linksGoals });
      alert("Profile completed! 🎉");
    }
  };

  return (
    <div className="min-h-screen bg-bgcolor flex flex-col items-center justify-start py-8 px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="bg-blob w-72 h-72 bg-highlightcolor top-[-80px] left-[-80px] animate-float" />
      <div className="bg-blob w-56 h-56 bg-blue-500 bottom-[-60px] right-[-60px] animate-float" style={{ animationDelay: "4s" }} />

      {/* Back Button - Top Left */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200 z-20 px-2 py-1"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Content */}
      <div className="w-full max-w-2xl relative z-10">
        <StepIndicator step={step} />

        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          {/* Scrollable content area */}
          <div className="overflow-y-auto max-h-[calc(100vh-280px)] pr-1 custom-scroll">
            {step === 1 && <Step1 data={basicInfo} setData={setBasicInfo} avatar={avatar} setAvatar={setAvatar} />}
            {step === 2 && <Step2 data={skillsInfo} setData={setSkillsInfo} />}
            {step === 3 && <Step3 data={linksGoals} setData={setLinksGoals} />}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end mt-6 pt-5 border-t border-white/10">
            <button
              onClick={handleContinue}
              className="flex items-center gap-2 bg-highlightcolor text-bgcolor font-bold text-sm px-6 py-3 rounded-xl hover:bg-highlightcolor/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-highlightcolor/25"
            >
              {step === 3 ? (
                <>Complete Profile <Check size={16} /></>
              ) : (
                <>Continue <ArrowRight size={16} /></>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(196, 170, 241, 0.3); border-radius: 2px; }
      `}</style>
    </div>
  );
}