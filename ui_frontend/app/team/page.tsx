'use client';

import React, { useState } from 'react';
import { Users, Mail, Link as LinkIcon, Copy, Share2, Trash2, Check, X, Edit2, Plus, MessageSquare, ChevronRight, AlertCircle } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: string;
  skills: string[];
  leader?: boolean;
}

interface PendingInvitation {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
  status: 'pending' | 'accepted' | 'declined';
  teamId: string;
}

interface JoinRequest {
  id: string;
  name: string;
  role: string;
  location: string;
  skills: string[];
  initials: string;
  color: string;
  teamId: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  tags: string[];
  members: TeamMember[];
  maxMembers: number;
  inviteLink: string;
  isPublic: boolean;
  createdAt: string;
  chatId?: string;
}

interface ChatGroup {
  id: string;
  teamId: string;
  teamName: string;
  members: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

export default function TeamPage() {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'HackMIT Innovation Squad',
      description: 'Building an AI-powered accessibility tool for the visually impaired.',
      tags: ['AI', 'Accessibility', 'React'],
      members: [
        { id: '1', name: 'John Doe', initials: 'JD', color: 'bg-blue-500', role: 'Lead', skills: ['React', 'TypeScript'], leader: true },
        { id: '2', name: 'Sarah Chen', initials: 'SC', color: 'bg-purple-500', role: 'Frontend', skills: ['Vue', 'CSS'] },
        { id: '3', name: 'Alex Rivera', initials: 'AR', color: 'bg-orange-500', role: 'Backend', skills: ['Node.js', 'PostgreSQL'] }
      ],
      maxMembers: 5,
      inviteLink: 'https://scout.app/invite/abc123xyz',
      isPublic: true,
      createdAt: '2024-01-15',
      chatId: 'chat_1'
    }
  ]);

  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([
    {
      id: 'chat_1',
      teamId: '1',
      teamName: 'HackMIT Innovation Squad',
      members: 3,
      lastMessage: 'John: Great progress on the accessibility features!',
      lastMessageTime: '2m ago'
    }
  ]);

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>('1');
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showEditTeam, setShowEditTeam] = useState(false);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [showInviteMembersModal, setShowInviteMembersModal] = useState(false);

  const [newTeamData, setNewTeamData] = useState({
    name: '',
    description: '',
    tags: [] as string[],
    maxMembers: 5,
    isPublic: true
  });

  const [tagInput, setTagInput] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [addMemberEmail, setAddMemberEmail] = useState('');
  const [addMemberRole, setAddMemberRole] = useState('Member');

  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([
    { id: '1', name: 'Emma Wilson', email: 'emma@example.com', initials: 'EW', color: 'bg-red-500', status: 'pending', teamId: '1' },
    { id: '2', name: 'Michael Brown', email: 'michael@example.com', initials: 'MB', color: 'bg-green-500', status: 'pending', teamId: '1' }
  ]);

  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([
    { id: '1', name: 'Lisa Johnson', role: 'Full-stack Developer', location: 'New York', skills: ['React', 'Node.js', 'MongoDB'], initials: 'LJ', color: 'bg-gray-500', teamId: '1' },
    { id: '2', name: 'David Park', role: 'AI/ML Engineer', location: 'San Francisco', skills: ['Python', 'TensorFlow', 'PyTorch'], initials: 'DP', color: 'bg-indigo-500', teamId: '1' }
  ]);

  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  const selectedTeam = teams.find(t => t.id === selectedTeamId);
  const availableSpots = selectedTeam ? selectedTeam.maxMembers - selectedTeam.members.length : 0;
  const teamJoinRequests = joinRequests.filter(r => r.teamId === selectedTeamId);
  const teamPendingInvitations = pendingInvitations.filter(p => p.teamId === selectedTeamId);

  const tagSuggestions = [
    'AI', 'ML', 'Web Dev', 'Mobile', 'Backend', 'Frontend', 'Full Stack',
    'DevOps', 'Cloud', 'Blockchain', 'Data Science', 'UX/UI', 'React',
    'Node.js', 'Python', 'Java', 'Go', 'Rust', 'Accessibility', 'Hackathon'
  ];

  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-cyan-500'];

  const handleCreateTeam = () => {
    if (newTeamData.name && newTeamData.description) {
      const newTeam: Team = {
        id: String(Date.now()),
        name: newTeamData.name,
        description: newTeamData.description,
        tags: newTeamData.tags,
        members: [],
        maxMembers: newTeamData.maxMembers,
        inviteLink: `https://scout.app/invite/${Math.random().toString(36).substr(2, 9)}`,
        isPublic: newTeamData.isPublic,
        createdAt: new Date().toISOString().split('T')[0],
        chatId: `chat_${Date.now()}`
      };
      setTeams([...teams, newTeam]);

      const newChatGroup: ChatGroup = {
        id: newTeam.chatId!,
        teamId: newTeam.id,
        teamName: newTeam.name,
        members: 0,
        lastMessage: 'Team created',
        lastMessageTime: 'now'
      };
      setChatGroups([...chatGroups, newChatGroup]);

      setSelectedTeamId(newTeam.id);
      setNewTeamData({ name: '', description: '', tags: [], maxMembers: 5, isPublic: true });
      setShowCreateTeam(false);
    }
  };

  const handleUpdateTeam = () => {
    if (newTeamData.name && newTeamData.description && selectedTeam) {
      setTeams(teams.map(t =>
        t.id === selectedTeamId
          ? { ...t, ...newTeamData }
          : t
      ));
      setShowEditTeam(false);
    }
  };

  const handleAddTag = (tag: string) => {
    if (!newTeamData.tags.includes(tag)) {
      setNewTeamData({
        ...newTeamData,
        tags: [...newTeamData.tags, tag]
      });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewTeamData({
      ...newTeamData,
      tags: newTeamData.tags.filter(t => t !== tag)
    });
  };

  const handleAddTagManually = () => {
    if (tagInput.trim() && !newTeamData.tags.includes(tagInput.trim())) {
      setNewTeamData({
        ...newTeamData,
        tags: [...newTeamData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleAddMember = () => {
    if (addMemberEmail && selectedTeam && availableSpots > 0) {
      const initials = addMemberEmail.substring(0, 2).toUpperCase();
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newMember: TeamMember = {
        id: String(selectedTeam.members.length + 1),
        name: addMemberEmail.split('@')[0],
        initials,
        color: randomColor,
        role: addMemberRole,
        skills: []
      };

      setTeams(teams.map(t =>
        t.id === selectedTeamId
          ? { ...t, members: [...t.members, newMember] }
          : t
      ));

      setChatGroups(chatGroups.map(cg =>
        cg.teamId === selectedTeamId
          ? { ...cg, members: cg.members + 1 }
          : cg
      ));

      setAddMemberEmail('');
      setAddMemberRole('Member');
      setShowAddMembersModal(false);
    }
  };

  const handleInviteMember = () => {
    if (inviteEmail && selectedTeam) {
      const newInvitation: PendingInvitation = {
        id: String(pendingInvitations.length + 1),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        initials: inviteEmail.substring(0, 2).toUpperCase(),
        color: colors[Math.floor(Math.random() * colors.length)],
        status: 'pending',
        teamId: selectedTeamId
      };
      setPendingInvitations([...pendingInvitations, newInvitation]);
      setInviteEmail('');
    }
  };

  const handleCopyInviteLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLinkId(link);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  const handleAcceptJoinRequest = (id: string) => {
    const request = joinRequests.find(r => r.id === id);
    if (request && selectedTeam && availableSpots > 0) {
      const newMember: TeamMember = {
        id: request.id,
        name: request.name,
        initials: request.initials,
        color: request.color,
        role: request.role,
        skills: request.skills
      };
      setTeams(teams.map(t =>
        t.id === selectedTeamId
          ? { ...t, members: [...t.members, newMember] }
          : t
      ));

      setChatGroups(chatGroups.map(cg =>
        cg.teamId === selectedTeamId
          ? { ...cg, members: cg.members + 1 }
          : cg
      ));

      setJoinRequests(joinRequests.filter(r => r.id !== id));
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setTeams(teams.map(t =>
      t.id === selectedTeamId
        ? { ...t, members: t.members.filter(m => m.id !== memberId) }
        : t
    ));

    setChatGroups(chatGroups.map(cg =>
      cg.teamId === selectedTeamId
        ? { ...cg, members: Math.max(0, cg.members - 1) }
        : cg
    ));
  };

  const openEditTeam = () => {
    if (selectedTeam) {
      setNewTeamData({
        name: selectedTeam.name,
        description: selectedTeam.description,
        tags: [...selectedTeam.tags],
        maxMembers: selectedTeam.maxMembers,
        isPublic: selectedTeam.isPublic
      });
      setShowEditTeam(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1C1C2A] via-[#1C1C2A] to-[#2A2A3A]">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 -left-40 w-80 h-80 bg-[#C4AAF1] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 bg-[#1C1C2A]/80 backdrop-blur-xl border-b border-white/5 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C4AAF1] to-purple-600 flex items-center justify-center">
                <Users className="text-white" size={20} />
              </div>
              <h1 className="text-2xl font-bold text-white">Teams</h1>
            </div>
            <button
              onClick={() => {
                setNewTeamData({ name: '', description: '', tags: [], maxMembers: 5, isPublic: true });
                setShowCreateTeam(true);
              }}
              className="px-6 py-2.5 rounded-lg bg-[#C4AAF1] text-[#1C1C2A] font-semibold hover:bg-[#C4AAF1]/90 transition-colors flex items-center gap-2"
            >
              <Plus size={18} /> Create Team
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Create Team Modal */}
          {showCreateTeam && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-[#1C1C2A] border border-white/30 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-white">Create New Team</h2>
                  <button onClick={() => setShowCreateTeam(false)} className="text-gray-400 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6 mb-8">
                  {/* Team Name */}
                  <div>
                    <label className="text-sm text-white/70 font-semibold block mb-3">Team Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Neural Ninjas"
                      value={newTeamData.name}
                      onChange={(e) => setNewTeamData({ ...newTeamData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/20 rounded-xl py-3.5 px-4 text-white placeholder-white/30 text-base focus:outline-none focus:border-[#C4AAF1] focus:bg-white/10 transition-all"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm text-white/70 font-semibold block mb-3">Description</label>
                    <textarea
                      placeholder="Passionate developers working on deep learning models, smart assistants, and next-gen data-driven platforms."
                      value={newTeamData.description}
                      onChange={(e) => setNewTeamData({ ...newTeamData, description: e.target.value })}
                      rows={4}
                      className="w-full bg-white/5 border border-white/20 rounded-xl py-3.5 px-4 text-white placeholder-white/30 text-base focus:outline-none focus:border-[#C4AAF1] focus:bg-white/10 transition-all resize-none"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="text-sm text-white/70 font-semibold block mb-3">Tags</label>

                    {/* Manual Tag Input */}
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add custom tag"
                        className="flex-1 bg-white/5 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C4AAF1] focus:bg-white/10 transition-all"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTagManually()}
                      />
                      <button
                        onClick={handleAddTagManually}
                        className="px-4 py-3 rounded-xl bg-[#C4AAF1]/20 border border-[#C4AAF1]/40 text-[#C4AAF1] text-sm font-semibold hover:bg-[#C4AAF1]/30 transition-all"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {/* Selected Tags */}
                    {newTeamData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                        {newTeamData.tags.map(tag => (
                          <span key={tag} className="px-3 py-1.5 rounded-lg bg-[#C4AAF1] text-[#1C1C2A] text-xs font-bold flex items-center gap-2">
                            {tag}
                            <button onClick={() => handleRemoveTag(tag)} className="hover:opacity-70">×</button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Tag Suggestions */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {tagSuggestions
                        .filter(t => !newTeamData.tags.includes(t))
                        .slice(0, 9)
                        .map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleAddTag(tag)}
                            className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white/60 text-xs font-medium hover:border-[#C4AAF1] hover:text-[#C4AAF1] hover:bg-[#C4AAF1]/10 transition-all"
                          >
                            {tag}
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Max Members & Visibility */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-white/70 font-semibold block mb-3">Team Size</label>
                      <input
                        type="number"
                        value={newTeamData.maxMembers}
                        onChange={(e) => setNewTeamData({ ...newTeamData, maxMembers: parseInt(e.target.value) || 5 })}
                        className="w-full bg-white/5 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C4AAF1] focus:bg-white/10 transition-all"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-white/70 font-semibold block mb-3">Visibility</label>
                      <select
                        value={newTeamData.isPublic ? 'public' : 'private'}
                        onChange={(e) => setNewTeamData({ ...newTeamData, isPublic: e.target.value === 'public' })}
                        className="w-full bg-white/5 border border-white/20 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#C4AAF1] focus:bg-white/10 transition-all"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCreateTeam(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTeam}
                    className="flex-1 px-6 py-3 rounded-xl bg-[#C4AAF1] text-[#1C1C2A] hover:bg-[#C4AAF1]/90 transition-colors font-semibold"
                  >
                    Create Team
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Team Modal */}
          {showEditTeam && selectedTeam && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-[#1C1C2A] border border-white/30 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-white">Edit Team</h2>
                  <button onClick={() => setShowEditTeam(false)} className="text-gray-400 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6 mb-8">
                  {/* Team Name */}
                  <div>
                    <label className="text-sm text-white/70 font-semibold block mb-3">Team Name</label>
                    <input
                      type="text"
                      value={newTeamData.name}
                      onChange={(e) => setNewTeamData({ ...newTeamData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/20 rounded-xl py-3.5 px-4 text-white placeholder-white/30 text-base focus:outline-none focus:border-[#C4AAF1] focus:bg-white/10 transition-all"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm text-white/70 font-semibold block mb-3">Description</label>
                    <textarea
                      value={newTeamData.description}
                      onChange={(e) => setNewTeamData({ ...newTeamData, description: e.target.value })}
                      rows={4}
                      className="w-full bg-white/5 border border-white/20 rounded-xl py-3.5 px-4 text-white placeholder-white/30 text-base focus:outline-none focus:border-[#C4AAF1] focus:bg-white/10 transition-all resize-none"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="text-sm text-white/70 font-semibold block mb-3">Tags</label>

                    {/* Manual Tag Input */}
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add custom tag"
                        className="flex-1 bg-white/5 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C4AAF1] focus:bg-white/10 transition-all"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTagManually()}
                      />
                      <button
                        onClick={handleAddTagManually}
                        className="px-4 py-3 rounded-xl bg-[#C4AAF1]/20 border border-[#C4AAF1]/40 text-[#C4AAF1] text-sm font-semibold hover:bg-[#C4AAF1]/30 transition-all"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {/* Selected Tags */}
                    {newTeamData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                        {newTeamData.tags.map(tag => (
                          <span key={tag} className="px-3 py-1.5 rounded-lg bg-[#C4AAF1] text-[#1C1C2A] text-xs font-bold flex items-center gap-2">
                            {tag}
                            <button onClick={() => handleRemoveTag(tag)} className="hover:opacity-70">×</button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Tag Suggestions */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {tagSuggestions
                        .filter(t => !newTeamData.tags.includes(t))
                        .slice(0, 9)
                        .map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleAddTag(tag)}
                            className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white/60 text-xs font-medium hover:border-[#C4AAF1] hover:text-[#C4AAF1] hover:bg-[#C4AAF1]/10 transition-all"
                          >
                            {tag}
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Max Members & Visibility */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-white/70 font-semibold block mb-3">Team Size</label>
                      <input
                        type="number"
                        value={newTeamData.maxMembers}
                        onChange={(e) => setNewTeamData({ ...newTeamData, maxMembers: parseInt(e.target.value) || 5 })}
                        className="w-full bg-white/5 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C4AAF1] focus:bg-white/10 transition-all"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-white/70 font-semibold block mb-3">Visibility</label>
                      <select
                        value={newTeamData.isPublic ? 'public' : 'private'}
                        onChange={(e) => setNewTeamData({ ...newTeamData, isPublic: e.target.value === 'public' })}
                        className="w-full bg-white/5 border border-white/20 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#C4AAF1] focus:bg-white/10 transition-all"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEditTeam(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateTeam}
                    className="flex-1 px-6 py-3 rounded-xl bg-[#C4AAF1] text-[#1C1C2A] hover:bg-[#C4AAF1]/90 transition-colors font-semibold"
                  >
                    Update Team
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Members Modal */}
          {showAddMembersModal && selectedTeam && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-[#1C1C2A] border border-white/30 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Add Member</h2>
                  <button onClick={() => setShowAddMembersModal(false)} className="text-gray-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <p className="text-sm text-gray-400">
                    Available spots: <span className="text-[#C4AAF1] font-bold">{availableSpots}/{selectedTeam.maxMembers}</span>
                  </p>

                  <div>
                    <label className="text-sm text-white/70 font-semibold block mb-3">Email Address</label>
                    <input
                      type="email"
                      value={addMemberEmail}
                      onChange={(e) => setAddMemberEmail(e.target.value)}
                      placeholder="member@example.com"
                      className="w-full bg-white/5 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C4AAF1] focus:bg-white/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-white/70 font-semibold block mb-3">Role</label>
                    <select
                      value={addMemberRole}
                      onChange={(e) => setAddMemberRole(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#C4AAF1] focus:bg-white/10 transition-all"
                    >
                      <option>Member</option>
                      <option>Frontend Developer</option>
                      <option>Backend Developer</option>
                      <option>Full Stack Developer</option>
                      <option>Designer</option>
                      <option>DevOps</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddMembersModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMember}
                    disabled={!addMemberEmail || availableSpots === 0}
                    className="flex-1 px-6 py-3 rounded-xl bg-[#C4AAF1] text-[#1C1C2A] hover:bg-[#C4AAF1]/90 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors font-semibold"
                  >
                    Add Member
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Invite Members Modal */}
          {showInviteMembersModal && selectedTeam && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-[#1C1C2A] border border-white/30 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Invite Member</h2>
                  <button onClick={() => setShowInviteMembersModal(false)} className="text-gray-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm text-white/70 font-semibold block mb-3">Email Address</label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="member@example.com"
                      className="w-full bg-white/5 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C4AAF1] focus:bg-white/10 transition-all"
                    />
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-xs text-white/50 font-semibold mb-3">Share Invite Link</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={selectedTeam.inviteLink}
                        readOnly
                        className="flex-1 bg-white/5 border border-white/20 rounded-xl py-3 px-4 text-white text-sm focus:outline-none"
                      />
                      <button
                        onClick={() => handleCopyInviteLink(selectedTeam.inviteLink)}
                        className="p-3 rounded-xl bg-white/5 border border-white/20 text-gray-400 hover:text-[#C4AAF1] hover:border-[#C4AAF1]/40 transition-all"
                      >
                        {copiedLinkId === selectedTeam.inviteLink ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                      </button>
                      <button className="p-3 rounded-xl bg-white/5 border border-white/20 text-gray-400 hover:text-[#C4AAF1] hover:border-[#C4AAF1]/40 transition-all">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowInviteMembersModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInviteMember}
                    disabled={!inviteEmail}
                    className="flex-1 px-6 py-3 rounded-xl bg-[#C4AAF1] text-[#1C1C2A] hover:bg-[#C4AAF1]/90 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors font-semibold"
                  >
                    Invite
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Layout - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Teams List */}
            <div className="lg:col-span-2 space-y-4">
              {teams.map(team => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`w-full text-left border rounded-2xl p-4 transition-all ${
                    selectedTeamId === team.id
                      ? 'bg-white/15 border-white/30'
                      : 'bg-white/8 border-white/15 hover:bg-white/12 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white">{team.name}</h3>
                      <p className="text-gray-400 text-xs line-clamp-1">{team.description}</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 bg-blue-500/20 text-blue-300">
                      {team.members.length}/{team.maxMembers}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {team.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded text-xs font-semibold bg-[#C4AAF1]/20 text-[#C4AAF1]">
                        {tag}
                      </span>
                    ))}
                    {team.tags.length > 2 && (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold text-gray-400">
                        +{team.tags.length - 2}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Right Column - Team Details & Join Requests */}
            <div className="space-y-6">
              {selectedTeam ? (
                <>
                  {/* Team Details Card */}
                  <div className="bg-white/15 border border-white/30 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">{selectedTeam.name}</h3>
                      <button
                        onClick={openEditTeam}
                        className="p-2 rounded-lg bg-white/5 border border-white/20 text-gray-400 hover:text-[#C4AAF1] hover:border-[#C4AAF1]/40 transition-all"
                        title="Edit Team"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>

                    {/* Members Section */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-white/70">MEMBERS</p>
                        {selectedTeam.members.length < selectedTeam.maxMembers && (
                          <button
                            onClick={() => setShowAddMembersModal(true)}
                            className="p-1.5 rounded-lg bg-[#C4AAF1]/20 border border-[#C4AAF1]/40 text-[#C4AAF1] hover:bg-[#C4AAF1]/30 transition-all"
                            title="Add Member"
                          >
                            <Plus size={14} />
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {selectedTeam.members.map(member => (
                          <div key={member.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                                {member.initials}
                              </div>
                              <div className="min-w-0">
                                <p className="text-white font-semibold text-xs truncate">{member.name}</p>
                                <p className="text-gray-500 text-xs">{member.role}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Invite Section */}
                    <button
                      onClick={() => setShowInviteMembersModal(true)}
                      className="w-full py-2.5 rounded-lg bg-[#C4AAF1]/20 border border-[#C4AAF1]/40 text-[#C4AAF1] text-sm font-semibold hover:bg-[#C4AAF1]/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Mail size={14} /> Invite
                    </button>
                  </div>

                  {/* Pending Invitations */}
                  {teamPendingInvitations.length > 0 && (
                    <div className="bg-white/15 border border-white/30 rounded-2xl p-6">
                      <h4 className="text-sm font-bold text-white mb-3">Pending ({teamPendingInvitations.length})</h4>
                      <div className="space-y-2">
                        {teamPendingInvitations.map(invitation => (
                          <div key={invitation.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className={`w-8 h-8 rounded-full ${invitation.color} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                                {invitation.initials}
                              </div>
                              <div className="min-w-0">
                                <p className="text-white font-semibold text-xs truncate">{invitation.name}</p>
                                <p className="text-gray-500 text-xs">Invited</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setPendingInvitations(pendingInvitations.filter(inv => inv.id !== invitation.id))}
                              className="text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white/15 border border-white/30 rounded-2xl p-6 text-center">
                  <AlertCircle size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">Select a team to view details</p>
                </div>
              )}

              {/* Join Requests Card - Always Visible */}
              {teamJoinRequests.length > 0 && (
                <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/30 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <AlertCircle size={16} className="text-orange-400" /> Join Requests ({teamJoinRequests.length})
                  </h4>
                  <div className="space-y-3">
                    {teamJoinRequests.map(request => (
                      <div key={request.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`w-9 h-9 rounded-full ${request.color} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                            {request.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm">{request.name}</p>
                            <p className="text-gray-400 text-xs">{request.role}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptJoinRequest(request.id)}
                            className="flex-1 px-3 py-2 rounded-lg bg-[#C4AAF1] text-[#1C1C2A] hover:bg-[#C4AAF1]/90 transition-colors text-xs font-bold flex items-center justify-center gap-1"
                          >
                            <Check size={14} /> Accept
                          </button>
                          <button
                            onClick={() => setJoinRequests(joinRequests.filter(r => r.id !== request.id))}
                            className="flex-1 px-3 py-2 rounded-lg border border-white/20 text-white hover:bg-red-500/10 hover:border-red-500/30 transition-colors text-xs font-bold"
                          >
                            Decline
                          </button>
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
    </div>
  );a
}