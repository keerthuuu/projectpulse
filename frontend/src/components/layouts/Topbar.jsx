import React, { useState } from 'react';
import { Search, Bell, Menu, LogOut, Shield, User, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../ui/Badge';
import { useNavigate } from 'react-router-dom';

export const Topbar = ({ onMenuClick }) => {
  const { user, logout, switchRole } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    switchRole(role);
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-navy-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left section: Hamburger on mobile + Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onMenuClick}
          className="p-2 text-slate-400 hover:text-white rounded-xl bg-navy-900 border border-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects, tasks, predictions or team members..."
            className="w-full pl-10 pr-4 py-2 bg-navy-900/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pulse-orange/60 focus:ring-1 focus:ring-pulse-orange/40 transition-all"
          />
        </div>
      </div>

      {/* Right section: User Role Badge + Notifications + User Menu */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* User Active Role Badge */}
        <div className="hidden md:flex items-center">
          <RoleBadge role={user?.role} />
        </div>

        {/* Notifications Icon Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2.5 rounded-xl bg-navy-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-pulse-orange rounded-full ring-2 ring-navy-950 animate-pulse" />
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl p-4 shadow-2xl z-50 border border-slate-700/80">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <h4 className="font-bold text-white text-sm">Notifications</h4>
                <button
                  onClick={() => {
                    setShowNotifMenu(false);
                    navigate('/notifications');
                  }}
                  className="text-xs text-pulse-orange hover:underline font-semibold"
                >
                  View All
                </button>
              </div>
              <div className="py-2 space-y-3 max-h-72 overflow-y-auto">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-white">Risk Warning</p>
                    <p className="text-slate-300">AI Analytics Engine predicted delay +12 days.</p>
                    <span className="text-[10px] text-slate-400">15 mins ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-navy-800/60 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-white">GitHub Synced</p>
                    <p className="text-slate-300">14 commits pushed to main branch.</p>
                    <span className="text-[10px] text-slate-400">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 rounded-xl bg-navy-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"}
              alt="User"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <div className="hidden sm:block text-left pr-1">
              <div className="text-xs font-bold text-white leading-tight">{user?.name || 'Alex Rivera'}</div>
              <div className="text-[10px] text-slate-400 font-mono">{user?.role || 'Admin'}</div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 glass-panel rounded-2xl p-2 shadow-2xl z-50 border border-slate-700">
              <div className="p-3 border-b border-slate-800">
                <p className="text-xs font-bold text-white">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                <div className="mt-2">
                  <RoleBadge role={user?.role} />
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/profile');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-navy-800 rounded-lg flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile Settings</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
