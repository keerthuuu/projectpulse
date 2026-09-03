import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Clock, ShieldCheck, UserCheck, Code } from 'lucide-react';

export const RiskBadge = ({ status = 'ON TRACK', size = 'md' }) => {
  const normalized = status.toUpperCase();

  const configs = {
    'ON TRACK': {
      label: 'ON TRACK',
      icon: CheckCircle2,
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
      dot: 'bg-emerald-400 animate-pulse',
    },
    'AT RISK': {
      label: 'AT RISK',
      icon: AlertTriangle,
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
      dot: 'bg-amber-400 animate-pulse',
    },
    'DELAYED': {
      label: 'DELAYED',
      icon: AlertCircle,
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      glow: 'shadow-[0_0_12px_rgba(244,63,94,0.25)]',
      dot: 'bg-rose-400 animate-pulse',
    },
  };

  const config = configs[normalized] || configs['ON TRACK'];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-mono font-medium tracking-wide uppercase ${config.bg} ${config.glow} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
};

export const RoleBadge = ({ role = 'admin' }) => {
  const normRole = (role || 'admin').toLowerCase().replace(' ', '_');
  const roleConfigs = {
    admin: {
      label: 'Admin / Manager',
      icon: ShieldCheck,
      color: 'bg-purple-500/15 border-purple-500/40 text-purple-300',
    },
    team_leader: {
      label: 'Team Leader',
      icon: UserCheck,
      color: 'bg-blue-500/15 border-blue-500/40 text-blue-300',
    },
    employee: {
      label: 'Employee',
      icon: Code,
      color: 'bg-teal-500/15 border-teal-500/40 text-teal-300',
    },
  };

  const config = roleConfigs[normRole] || roleConfigs['admin'];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${config.color}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
};

export const PriorityBadge = ({ priority = 'Medium' }) => {
  const priorityColors = {
    Low: 'bg-slate-700/50 text-slate-300 border-slate-600',
    Medium: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    High: 'bg-pulse-orange/15 text-pulse-orange border-pulse-orange/30 font-semibold',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${priorityColors[priority] || priorityColors['Medium']}`}>
      {priority}
    </span>
  );
};

export default RiskBadge;
