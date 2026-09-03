import React from 'react';
import TaskCard from './TaskCard';
import { Circle, PlayCircle, AlertOctagon, CheckCircle2 } from 'lucide-react';

export const KanbanBoard = ({ tasks, onStatusChange }) => {
  const columns = [
    {
      id: 'NOT STARTED',
      title: 'NOT STARTED',
      icon: Circle,
      color: 'text-slate-400 border-slate-700 bg-slate-800/40',
      badgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'IN PROGRESS',
      title: 'IN PROGRESS',
      icon: PlayCircle,
      color: 'text-blue-400 border-blue-500/30 bg-blue-950/20',
      badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    },
    {
      id: 'BLOCKED',
      title: 'BLOCKED',
      icon: AlertOctagon,
      color: 'text-rose-400 border-rose-500/40 bg-rose-950/20',
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse',
    },
    {
      id: 'COMPLETED',
      title: 'COMPLETED',
      icon: CheckCircle2,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    },
  ];

  const normalizeStatus = (s) => (s || '').toUpperCase().replace(/_/g, ' ');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {columns.map((col) => {
        const Icon = col.icon;
        const colTasks = (tasks || []).filter((t) => normalizeStatus(t.status) === col.id);

        return (
          <div
            key={col.id}
            className="flex flex-col rounded-2xl bg-navy-900/60 border border-slate-800/80 backdrop-blur-md p-4 min-h-[500px]"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between p-3 rounded-xl border mb-4 ${col.color}`}>
              <div className="flex items-center gap-2 font-mono font-bold text-xs tracking-wider">
                <Icon className="w-4 h-4" />
                <span>{col.title}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-extrabold ${col.badgeColor}`}>
                {colTasks.length}
              </span>
            </div>

            {/* Task list container */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-0.5 custom-scrollbar">
              {colTasks.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl text-slate-500 text-xs font-mono">
                  <span>No tasks in {col.title.toLowerCase()}</span>
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
