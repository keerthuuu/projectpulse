import React from 'react';
import KpiCard from './KpiCard';
import GlassCard from '../ui/GlassCard';
import RiskBadge, { PriorityBadge } from '../ui/Badge';
import FireArrowButton from '../ui/FireArrowButton';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CheckSquare,
  AlertOctagon,
  Clock,
  ArrowRight,
  UserCheck,
  Flame
} from 'lucide-react';

export const LeaderDashboard = ({ projects, tasks }) => {
  const navigate = useNavigate();

  const assignedProjects = (projects || []).slice(0, 2);
  const activeTasks = (tasks || []).filter(t => (t.status || '').toUpperCase().replace(/_/g, ' ') !== 'COMPLETED');
  const blockedTasks = (tasks || []).filter(t => (t.status || '').toUpperCase() === 'BLOCKED');

  return (
    <div className="space-y-8">
      {/* Role Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-navy-900 to-navy-950 border border-blue-500/30 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Team Leader Operations Console</h2>
            <p className="text-xs text-slate-300">Managing Sprint Velocity, Blockers & Member Throughput</p>
          </div>
        </div>
        <FireArrowButton onClick={() => navigate('/tasks')} size="sm">
          Manage Sprint Tasks
        </FireArrowButton>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          title="Assigned Projects"
          value={assignedProjects.length}
          subtitle="2 Active Sprints"
          icon={Users}
          statusColor="blue"
        />
        <KpiCard
          title="Active Tasks"
          value={activeTasks.length}
          subtitle="In flight this week"
          icon={CheckSquare}
          statusColor="orange"
        />
        <KpiCard
          title="Sprint Blockers"
          value={blockedTasks.length}
          subtitle="Urgent resolution needed"
          icon={AlertOctagon}
          statusColor="red"
          trendPositive={false}
        />
        <KpiCard
          title="Team Completion Rate"
          value="74%"
          subtitle="+8% vs last sprint"
          icon={Flame}
          statusColor="green"
        />
      </div>

      {/* Grid: Sprint Blockers Focus & Active Team Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Critical Task Blockers */}
        <GlassCard className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-400" />
                <span>Sprint Blockers & Risks</span>
              </h3>
              <p className="text-xs text-slate-400">Tasks preventing deadline target completion</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
              {blockedTasks.length} Blocked
            </span>
          </div>

          <div className="space-y-3">
            {blockedTasks.map((t) => (
              <div key={t.id} className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-sm">{t.title}</h4>
                  <PriorityBadge priority={t.priority} />
                </div>
                <p className="text-xs text-slate-300">{t.description}</p>
                <div className="flex flex-wrap justify-between items-center text-[11px] pt-2 border-t border-rose-500/20 text-rose-300">
                  <span>Assigned: <strong>{t.assignedTo || 'Team Member'}</strong></span>
                  <span className="font-mono bg-rose-500/20 px-2 py-0.5 rounded">
                    {(t.dependencies && t.dependencies[0]) || 'Blocked by external dependency'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Right: Team Workload Overview */}
        <GlassCard className="space-y-4">
          <h3 className="text-lg font-bold text-white">Team Member Throughput</h3>
          <p className="text-xs text-slate-400">Active allocations & tasks completed</p>

          <div className="space-y-3">
            {[
              { name: 'Sarah Jenkins', role: 'Team Lead', tasks: 3, done: '100%', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
              { name: 'David Chen', role: 'DevOps Lead', tasks: 4, done: '85%', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
              { name: 'Marcus Vance', role: 'Data Scientist', tasks: 2, done: '40%', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
              { name: 'Elena Rostova', role: 'Backend Engineer', tasks: 3, done: '60%', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
            ].map((m, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-navy-900 border border-slate-800">
                <div className="flex items-center gap-3">
                  <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <div className="text-xs font-bold text-white">{m.name}</div>
                    <div className="text-[10px] text-slate-400">{m.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-pulse-orange font-mono">{m.done}</div>
                  <div className="text-[10px] text-slate-400">{m.tasks} tasks</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default LeaderDashboard;
