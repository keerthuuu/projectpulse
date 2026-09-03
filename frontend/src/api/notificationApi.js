import apiClient from './axios';
import { MOCK_NOTIFICATIONS } from './mockData';

export const notificationApi = {
  getNotifications: async () => {
    try {
      const response = await apiClient.get('/notifications');
      return response.data?.data || (Array.isArray(response.data) ? response.data : MOCK_NOTIFICATIONS);
    } catch (err) {
      return MOCK_NOTIFICATIONS;
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await apiClient.patch(`/notifications/${id}/read`);
      return response.data?.data || response.data;
    } catch (err) {
      const notif = MOCK_NOTIFICATIONS.find(n => n.id === id);
      if (notif) notif.read = true;
      return notif;
    }
  },

  markAllAsRead: async () => {
    try {
      await apiClient.post('/notifications/mark-all-read');
    } catch (err) {
      MOCK_NOTIFICATIONS.forEach(n => n.read = true);
    }
    return true;
  }
};

export default notificationApi;
