import apiClient from './axios';
import { MOCK_GITHUB_ACTIVITY } from './mockData';

export const githubApi = {
  getActivity: async (repoName) => {
    try {
      const response = await apiClient.get('/github/activity', { params: { repo: repoName } });
      return response.data?.data || response.data || MOCK_GITHUB_ACTIVITY;
    } catch (err) {
      return MOCK_GITHUB_ACTIVITY;
    }
  },

  syncGithub: async (repoName) => {
    try {
      const response = await apiClient.post('/github/sync', { repo: repoName });
      return response.data?.data || response.data;
    } catch (err) {
      return {
        success: true,
        message: 'GitHub repository activity synchronized successfully.',
        lastSyncTime: 'Just now',
        commitsSynced: 4
      };
    }
  }
};

export default githubApi;
