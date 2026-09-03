import React, { useState } from 'react';
import GlassCard from '../ui/GlassCard';
import KpiCard from './KpiCard';
import { PriorityBadge } from '../ui/Badge';
import FireArrowButton from '../ui/FireArrowButton';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  AlertCircle,
  Code2,
  Send,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import taskApi from '../../api/taskApi';

export const EmployeeDashboard = ({ tasks }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Tasks assigned to employee
  const myTasks = (tasks || []).slice(0, 3);
  const [activeTask, setActiveTask] = useState(myTasks[0]);
  const [progressVal, setProgressVal] = useState(activeTask?.progress || 60);
  const [isSaving, setIsSaving] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, author: 'Sarah Jenkins', role: 'Team Lead', text: 'Great progress on the CI/CD pipeline! Please double check GitHub Webhook secrets.', time: '2 hours ago' },
    { id: 2, author: user?.name || 'Alex Rivera', role: 'Developer', text: 'Staging build passed successfully. Testing production migration script now.', time: '45 mins ago' }
  ]);
  const [commentText, setCommentText] = useState('');

  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    if (activeTask) {
      setIsSaving(true);
      try {
        await taskApi.updateTaskStatus(activeTask.id, activeTask.status, progressVal);
        activeTask.progress = progressVal;
        activeTask.progress_percent = progressVal;
      } catch (err) {
        console.error('Error updating progress:', err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments([
      ...comments,
      {
        id: Date.now(),
        author: user?.name || 'Alex Rivera',
        role: user?.role || 'Employee',
        text: commentText,
        time: 'Just now'
      }
    ]);
    setCommentText('');
  };

  return (
    <div className="space-y-8">
      {/* Role Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-900/40 via-navy-900 to-navy-950 border border-teal-500/30 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Employee Workspace</h2>
            <p className="text-xs text-slate-300">Update Task Progress & Synchronize GitHub Commit Activity</p>
          </div>
        </div>
        <FireArrowButton onClick={() => navigate('/tasks')} size="sm">
          Open Task Kanban
        </FireArrowButton>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          title="Assigned Tasks"
          value={myTasks.length}
          subtitle="Assigned to me"
          icon={CheckSquare}
          statusColor="orange"
        />
        <KpiCard
          title="Avg My Progress"
          value="72%"
          subtitle="Target completion 90%"
          icon={Sparkles}
          statusColor="green"
        />
        <KpiCard
          title="Next Deadline"
          value="3 Days"
          subtitle="Cloud Migration setup"
          icon={Clock}
          statusColor="amber"
        />
        <KpiCard
          title="My Blockers"
          value="0"
          subtitle="All paths clear"
          icon={AlertCircle}
          statusColor="blue"
        />
      </div>

      {/* Grid: Task Progress Update Slider & Task Comments Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Quick Progress Update Card */}
        <GlassCard className="lg:col-span-2 space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white">Update Task Progress</h3>
            <p className="text-xs text-slate-400">Select task and move progress slider to sync with backend model</p>
          </div>

          {/* Task selector tabs */}
          <div className="flex flex-wrap gap-2">
            {myTasks.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTask(t);
                  setProgressVal(t.progress);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTask?.id === t.id
                    ? 'bg-pulse-orange text-white shadow-glow-orange/40'
                    : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {t.title.slice(0, 24)}...
              </button>
            ))}
          </div>

          {/* Active Task Card Details */}
          {activeTask && (
            <div className="p-5 rounded-2xl bg-navy-900/90 border border-slate-800 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono uppercase text-pulse-orange tracking-wider font-bold">
                    {activeTask.projectName}
                  </span>
                  <h4 className="text-base font-bold text-white mt-0.5">{activeTask.title}</h4>
                </div>
                <PriorityBadge priority={activeTask.priority} />
              </div>
              <p className="text-xs text-slate-300">{activeTask.description}</p>

              {/* Animated Progress Slider UI */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Updated Task Progress</span>
                  <span className="text-pulse-orange font-mono font-extrabold text-lg">{progressVal}% Complete</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progressVal}
                  onChange={(e) => setProgressVal(Number(e.target.value))}
                  className="w-full h-2.5 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-pulse-orange border border-slate-800"
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>0% (Not Started)</span>
                  <span>50% (In Progress)</span>
                  <span>100% (Completed)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400">Planned End: <strong className="text-slate-200">{activeTask.plannedEnd}</strong></span>
                <FireArrowButton onClick={handleUpdateProgress} size="sm">
                  Save Progress Update
                </FireArrowButton>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Right: Comments & Task Activity */}
        <GlassCard className="space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-pulse-orange" />
              <span>Task Discussion</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">Team comments & sync updates</p>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {comments.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-navy-900/80 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{c.author}</span>
                    <span className="text-[10px] text-slate-400">{c.time}</span>
                  </div>
                  <span className="text-[10px] text-pulse-orange font-mono">{c.role}</span>
                  <p className="text-xs text-slate-300 mt-1">{c.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Add Comment Input */}
          <form onSubmit={handleAddComment} className="pt-3 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-3 py-2 bg-navy-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pulse-orange/60"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-pulse-orange text-white hover:bg-pulse-orange-dark transition-colors flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
