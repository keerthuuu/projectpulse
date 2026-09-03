import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../ui/Logo';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Github,
  TrendingUp,
  Sliders,
  BarChart3,
  Bell,
  User,
  Settings,
  X,
  ShieldCheck,
  UserCheck,
  Code
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'GitHub Activity', path: '/github', icon: Github },
    { name: 'Deadline Prediction', path: '/prediction', icon: TrendingUp },
    { name: 'What-If Analysis', path: '/what-if', icon: Sliders },
    { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'User Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-navy-900/90 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/60">
          <NavLink to="/" onClick={onClose}>
            <Logo size="sm" />
          </NavLink>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden hover:bg-navy-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Role Badge Box */}
        <div className="px-4 py-3 mx-3 my-3 bg-navy-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"}
            alt={user?.name || "User"}
            className="w-9 h-9 rounded-lg object-cover ring-1 ring-pulse-orange/40"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">{user?.name || 'Alex Rivera'}</div>
            <div className="flex items-center gap-1 text-[11px] text-pulse-orange font-semibold">
              {((user?.role || 'admin').toLowerCase().replace(' ', '_') === 'admin') && (
                <>
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin View</span>
                </>
              )}
              {((user?.role || '').toLowerCase().replace(' ', '_') === 'team_leader') && (
                <>
                  <UserCheck className="w-3 h-3" />
                  <span>Team Leader View</span>
                </>
              )}
              {((user?.role || '').toLowerCase().replace(' ', '_') === 'employee') && (
                <>
                  <Code className="w-3 h-3" />
                  <span>Employee View</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Nav Items List */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Main Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-pulse-orange/20 to-navy-800 text-white border-l-4 border-pulse-orange shadow-glow-orange/20 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-navy-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-pulse-orange drop-shadow-[0_0_6px_rgba(255,87,34,0.6)]' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800/60 text-center">
          <div className="text-[11px] text-slate-400">
            ProjectPulse v2.4 SaaS
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Backend REST Connected
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
