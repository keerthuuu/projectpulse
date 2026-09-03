import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import LeaderDashboard from '../components/dashboard/LeaderDashboard';
import EmployeeDashboard from '../components/dashboard/EmployeeDashboard';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import projectApi from '../api/projectApi';
import taskApi from '../api/taskApi';
import predictionApi from '../api/predictionApi';
import githubApi from '../api/githubApi';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [githubActivity, setGithubActivity] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projData, taskData, predData, ghData] = await Promise.all([
          projectApi.getAllProjects(),
          taskApi.getTasks(),
          predictionApi.getProjectPrediction('proj-2'),
          githubApi.getActivity()
        ]);
        setProjects(projData);
        setTasks(taskData);
        setPredictions(predData);
        setGithubActivity(ghData);
      } catch (err) {
        console.error('Failed to load dashboard telemetry:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Render role-specific dashboard strictly matching database user.role
  const normRole = (user?.role || 'admin').toLowerCase().replace(' ', '_');

  return (
    <div className="space-y-6">
      {normRole === 'admin' && (
        <AdminDashboard
          projects={projects}
          predictions={predictions}
          githubActivity={githubActivity}
        />
      )}

      {normRole === 'team_leader' && (
        <LeaderDashboard
          projects={projects}
          tasks={tasks}
        />
      )}

      {normRole === 'employee' && (
        <EmployeeDashboard
          tasks={tasks}
        />
      )}
    </div>
  );
};

export default DashboardPage;
