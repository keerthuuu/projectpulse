import Notification from '../models/Notification.js';

const SEED_NOTIFS = [
  {
    id: 'notif-1',
    type: 'risk_change',
    title: 'Risk Status Updated',
    message: 'AI Deadline Analytics Engine risk status changed from AT RISK to DELAYED by backend predictor.',
    timestamp: '15 minutes ago',
    is_read: false,
    read: false,
    projectId: 'proj-2'
  },
  {
    id: 'notif-2',
    type: 'blocker',
    title: 'New Task Blocker Reported',
    message: 'Marcus Vance marked "Train Historical Model" as BLOCKED: Waiting on DB dump.',
    timestamp: '1 hour ago',
    is_read: false,
    read: false,
    projectId: 'proj-2'
  },
  {
    id: 'notif-3',
    type: 'assignment',
    title: 'New Task Assigned',
    message: 'You were assigned to "PostgreSQL Database Indexing Optimization".',
    timestamp: '3 hours ago',
    is_read: true,
    read: true,
    projectId: 'proj-1'
  }
];

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ created_at: -1 });

    if (notifications.length === 0) {
      return res.status(200).json({ success: true, data: SEED_NOTIFS });
    }

    return res.status(200).json({ success: true, data: notifications.map(n => n.toJSON()) });
  } catch (err) {
    return res.status(200).json({ success: true, data: SEED_NOTIFS });
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    try {
      await Notification.findByIdAndUpdate(id, { is_read: true });
    } catch (e) {
      // fallback for seed IDs
      const target = SEED_NOTIFS.find(n => n.id === id);
      if (target) {
        target.is_read = true;
        target.read = true;
      }
    }

    return res.status(200).json({
      success: true,
      message: `Notification ${id} marked as read.`
    });
  } catch (err) {
    next(err);
  }
};

export const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ is_read: false }, { is_read: true });
    SEED_NOTIFS.forEach(n => {
      n.is_read = true;
      n.read = true;
    });

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (err) {
    next(err);
  }
};
