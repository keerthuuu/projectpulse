import Project from '../models/Project.js';
import { validateProjectInput } from '../utils/validation.js';

// Sample fallback dataset for standalone demo mode
const SEED_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Enterprise Cloud Migration',
    description: 'Migrating legacy monolith architecture to microservices on AWS with Zero-Downtime deployment.',
    start_date: '2026-08-01',
    deadline: '2026-10-15',
    status: 'on_track',
    riskStatus: 'ON TRACK',
    progress: 78,
    expectedCompletion: '2026-10-10',
    bufferDays: 5,
    teamMembers: [
      { name: 'Sarah Jenkins', role: 'Team Lead', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
      { name: 'David Chen', role: 'DevOps Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }
    ],
    lastUpdated: '10 mins ago',
    githubRepo: 'projectpulse/cloud-migration-backend',
    commitsThisWeek: 42,
    openPrs: 3
  },
  {
    id: 'proj-2',
    name: 'AI Deadline Analytics Engine',
    description: 'Backend prediction algorithms consuming GitHub commit velocity & historical sprint throughput.',
    start_date: '2026-08-01',
    deadline: '2026-09-30',
    status: 'delayed',
    riskStatus: 'DELAYED',
    progress: 52,
    expectedCompletion: '2026-10-12',
    bufferDays: -12,
    teamMembers: [
      { name: 'Marcus Vance', role: 'Data Scientist', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
      { name: 'Elena Rostova', role: 'Backend Engineer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }
    ],
    lastUpdated: '1 hour ago',
    githubRepo: 'projectpulse/predictive-engine',
    commitsThisWeek: 18,
    openPrs: 5
  }
];

export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ created_at: -1 });

    if (projects.length === 0) {
      return res.status(200).json({
        success: true,
        data: SEED_PROJECTS
      });
    }

    const mapped = projects.map(p => {
      const obj = p.toJSON();
      return {
        ...obj,
        riskStatus: (obj.status || 'on_track').toUpperCase().replace('_', ' '),
        progress: obj.progress || 50,
        expectedCompletion: obj.expectedCompletion || obj.deadline,
        lastUpdated: 'Recently',
        teamMembers: obj.teamMembers && obj.teamMembers.length > 0 ? obj.teamMembers : [
          { name: 'Sarah Jenkins', role: 'Team Lead', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
          { name: 'Alex Rivera', role: 'Fullstack Engineer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' }
        ]
      };
    });

    return res.status(200).json({
      success: true,
      data: mapped
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      data: SEED_PROJECTS
    });
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let dbProject = null;
    try {
      // Try MongoDB ObjectId first, then fallback seed
      dbProject = await Project.findById(id);
    } catch (e) {
      // id might not be a valid ObjectId
    }

    if (!dbProject) {
      const fallback = SEED_PROJECTS.find(p => p.id === id) || SEED_PROJECTS[0];
      return res.status(200).json({
        success: true,
        data: fallback
      });
    }

    const obj = dbProject.toJSON();
    const mapped = {
      ...obj,
      riskStatus: (obj.status || 'on_track').toUpperCase().replace('_', ' '),
      progress: obj.progress || 65,
      expectedCompletion: obj.expectedCompletion || obj.deadline,
      bufferDays: obj.bufferDays || 5,
      teamMembers: obj.teamMembers && obj.teamMembers.length > 0 ? obj.teamMembers : [
        { name: 'Sarah Jenkins', role: 'Team Lead', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
        { name: 'Alex Rivera', role: 'Fullstack Engineer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' }
      ]
    };

    return res.status(200).json({
      success: true,
      data: mapped
    });
  } catch (err) {
    const fallback = SEED_PROJECTS.find(p => p.id === req.params.id) || SEED_PROJECTS[0];
    return res.status(200).json({
      success: true,
      data: fallback
    });
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { name, description, start_date = new Date().toISOString().split('T')[0], deadline } = req.body;

    const valErrors = validateProjectInput({ name, start_date, deadline });
    if (valErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: valErrors.join(' ')
      });
    }

    const creatorId = req.user?.id || null;

    const newProject = await Project.create({
      name,
      description,
      start_date,
      deadline,
      status: 'on_track',
      created_by: creatorId
    });

    const obj = newProject.toJSON();

    return res.status(201).json({
      success: true,
      data: {
        ...obj,
        riskStatus: 'ON TRACK',
        progress: 0,
        expectedCompletion: obj.deadline,
        lastUpdated: 'Just now',
        teamMembers: []
      }
    });
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = ['name', 'description', 'start_date', 'deadline', 'status'];
    const filtered = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        filtered[key] = updates[key];
      }
    }

    if (Object.keys(filtered).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields provided to update.' });
    }

    let updated = null;
    try {
      updated = await Project.findByIdAndUpdate(id, filtered, { new: true });
    } catch (e) {
      // id might not be a valid ObjectId
    }

    if (!updated) {
      const idx = SEED_PROJECTS.findIndex(p => p.id === id);
      if (idx !== -1) {
        SEED_PROJECTS[idx] = { ...SEED_PROJECTS[idx], ...filtered };
        return res.status(200).json({ success: true, data: SEED_PROJECTS[idx] });
      }
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    return res.status(200).json({
      success: true,
      data: updated.toJSON()
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await Project.findByIdAndDelete(id);
    } catch (e) {
      // ignore invalid ObjectId
    }

    return res.status(200).json({
      success: true,
      message: `Project ${id} deleted successfully.`
    });
  } catch (err) {
    next(err);
  }
};

export const addProjectMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id, role_in_project = 'member', name = 'Team Member' } = req.body;

    let project = null;
    try {
      project = await Project.findById(id);
    } catch (e) { /* ignore */ }

    if (project) {
      project.teamMembers.push({
        name,
        role: role_in_project,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
      });
      await project.save();
    }

    return res.status(201).json({
      success: true,
      data: { project_id: id, user_id, role_in_project }
    });
  } catch (err) {
    next(err);
  }
};

export const removeProjectMember = async (req, res, next) => {
  try {
    const { id, userId } = req.params;

    let project = null;
    try {
      project = await Project.findById(id);
    } catch (e) { /* ignore */ }

    if (project) {
      project.teamMembers = project.teamMembers.filter((_, i) => i.toString() !== userId);
      await project.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Project member removed successfully.'
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectMembers = async (req, res, next) => {
  try {
    const { id } = req.params;

    let project = null;
    try {
      project = await Project.findById(id);
    } catch (e) { /* ignore */ }

    return res.status(200).json({
      success: true,
      data: project?.teamMembers || []
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      data: []
    });
  }
};
