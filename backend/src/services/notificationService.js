import Notification from '../models/Notification.js';

export const notificationService = {
  createNotification: async ({ userId, message, type }) => {
    try {
      const allowedTypes = ['risk_change', 'blocker', 'assignment', 'deadline_reminder'];
      if (!allowedTypes.includes(type)) {
        type = 'risk_change';
      }

      const notification = await Notification.create({
        user_id: userId,
        title: type === 'blocker' ? 'Task Blocked' : type === 'assignment' ? 'New Assignment' : 'Update',
        message,
        type,
        is_read: false
      });

      return notification.toJSON();
    } catch (err) {
      console.warn('MongoDB insert notification warning:', err.message);
      return {
        id: `notif-${Date.now()}`,
        user_id: userId,
        message,
        type,
        is_read: false,
        created_at: new Date().toISOString()
      };
    }
  }
};

export default notificationService;
