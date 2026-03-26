"use client";

import { useState } from "react";
import { CheckCheck, Users, Heart, MessageCircle, Bell, AtSign, Settings, X } from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    group: "TODAY",
    type: "Teams",
    icon: <Users size={18} className="text-[#C4AAF1]" />,
    iconBg: "bg-[#2E2A3D]",
    borderColor: "border-l-[#C4AAF1]",
    title: "Team Invite from DesignHub",
    time: "6 minutes ago",
    description: 'You\'ve been invited to join the DesignHub team. Collaborate on UI/UX projects with 12 other members.',
    tag: "Team Invite",
    read: false,
  },
  {
    id: 2,
    group: "TODAY",
    type: "Likes",
    icon: <Heart size={18} className="text-pink-400" />,
    iconBg: "bg-[#2E2A3D]",
    borderColor: "border-l-pink-400",
    title: "Alex Chen liked your post",
    time: "24 minutes ago",
    description: 'Your post "Building Scalable APIs with Edge Functions" received a new like.',
    tag: "Like",
    read: false,
  },
  {
    id: 3,
    group: "TODAY",
    type: "Messages",
    icon: <MessageCircle size={18} className="text-sky-400" />,
    iconBg: "bg-[#2E2A3D]",
    borderColor: "border-l-sky-400",
    title: "New message from Sarah Kim",
    time: "about 2 hours ago",
    description: "Hey! I saw your portfolio — would love to chat about a potential collaboration on a React Native project.",
    tag: "Message",
    read: false,
  },
  {
    id: 4,
    group: "YESTERDAY",
    type: "Mentions",
    icon: <AtSign size={18} className="text-amber-400" />,
    iconBg: "bg-[#2E2A3D]",
    borderColor: "border-l-amber-400",
    title: "Jordan Rivera mentioned you",
    time: "Yesterday, 4:15 PM",
    description: 'Jordan mentioned you in a comment: "@you this solution is exactly what we needed!"',
    tag: "Mention",
    read: true,
  },
  {
    id: 5,
    group: "YESTERDAY",
    type: "System",
    icon: <Settings size={18} className="text-emerald-400" />,
    iconBg: "bg-[#2E2A3D]",
    borderColor: "border-l-emerald-400",
    title: "System update completed",
    time: "Yesterday, 1:00 AM",
    description: "Your workspace has been updated to v3.2.1. New features: improved editor performance and dark mode fixes.",
    tag: "System",
    read: true,
  },
];

const TABS = ["All", "Messages", "Likes", "Teams", "Mentions", "System"];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered =
    activeTab === "All"
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Group notifications
  const groups = filtered.reduce((acc, notif) => {
    if (!acc[notif.group]) acc[notif.group] = [];
    acc[notif.group].push(notif);
    return acc;
  }, {});

  return (
    <div
      className="min-h-screen w-full flex items-start justify-center pt-10 px-4"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      {/* Background blobs */}
      <div
        className="bg-blob animate-float"
        style={{
          width: 400,
          height: 400,
          top: "-80px",
          left: "-100px",
          background: "#C4AAF1",
        }}
      />
      <div
        className="bg-blob animate-float"
        style={{
          width: 300,
          height: 300,
          bottom: "60px",
          right: "-60px",
          background: "#7B8CDE",
          animationDelay: "3s",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #C4AAF1, #7B8CDE)" }}
            >
              <Bell size={18} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-color)" }}>
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: "#C4AAF1", color: "#1C1C2A" }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-80"
            style={{ color: "#C4AAF1" }}
          >
            <CheckCheck size={16} />
            Mark all read
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={
                activeTab === tab
                  ? { background: "#C4AAF1", color: "#1C1C2A" }
                  : {
                    background: "#2A2A3C",
                    color: "#CCCCDD",
                    border: "1px solid #3A3A50",
                  }
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notification Groups */}
        {Object.keys(groups).length === 0 ? (
          <div className="text-center py-16" style={{ color: "#888" }}>
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p>No notifications here</p>
          </div>
        ) : (
          Object.entries(groups).map(([group, items]) => (
            <div key={group} className="mb-6">
              <p
                className="text-xs font-semibold tracking-widest mb-3 pl-1"
                style={{ color: "#888" }}
              >
                {group}
              </p>
              <div className="flex flex-col gap-3">
                {items.map((notif) => (
                  <div
                    key={notif.id}
                    className={`relative flex gap-4 rounded-xl p-4 border-l-4 transition-all duration-200 ${notif.borderColor}`}
                    style={{
                      background: notif.read ? "#1F1F2E" : "#252535",
                      border: "1px solid #2E2E42",
                      borderLeftWidth: "4px",
                    }}
                  >
                    {/* Unread dot */}
                    {!notif.read && (
                      <span
                        className="absolute top-4 right-10 w-2 h-2 rounded-full"
                        style={{ background: "#C4AAF1" }}
                      />
                    )}

                    {/* Dismiss */}
                    <button
                      onClick={() => dismissNotification(notif.id)}
                      className="absolute top-3 right-3 opacity-30 hover:opacity-70 transition-opacity"
                      style={{ color: "#aaa" }}
                    >
                      <X size={14} />
                    </button>

                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${notif.iconBg}`}
                    >
                      {notif.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-sm leading-tight" style={{ color: "var(--text-color)" }}>
                          {notif.title}
                        </p>
                        <span className="text-xs flex-shrink-0" style={{ color: "#777" }}>
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-sm leading-snug mb-2.5" style={{ color: "#AAAACC" }}>
                        {notif.description}
                      </p>
                      <span
                        className="inline-block text-xs px-2.5 py-0.5 rounded-md font-medium"
                        style={{ background: "#2E2A3D", color: "#C4AAF1" }}
                      >
                        {notif.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}