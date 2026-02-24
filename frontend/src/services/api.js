import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Elections
export const getElections = () => api.get('/elections');
export const getElection = (id) => api.get(`/elections/${id}`);
export const getElectionsByStatus = (status) => api.get(`/elections/status/${status}`);
export const createElection = (election) => api.post('/elections', election);
export const updateElection = (id, election) => api.put(`/elections/${id}`, election);
export const deleteElection = (id) => api.delete(`/elections/${id}`);

// Candidates
export const getCandidates = (electionId) => api.get(`/elections/${electionId}/candidates`);
export const addCandidate = (electionId, candidate) => api.post(`/elections/${electionId}/candidates`, candidate);
export const deleteCandidate = (candidateId) => api.delete(`/elections/candidates/${candidateId}`);

// Voting
export const castVote = (electionId, candidateId) => api.post(`/elections/${electionId}/vote`, { candidateId });
export const hasVoted = (electionId) => api.get(`/elections/${electionId}/has-voted`);

// Results
export const getResults = (electionId) => api.get(`/elections/${electionId}/results`);

// Analytics
export const getDashboardStats = () => api.get('/analytics/dashboard');
export const getVoterTurnout = (electionId) => api.get(`/analytics/turnout/${electionId}`);

// Anomalies
export const getAnomalies = () => api.get('/anomalies');
export const getAnomaliesByElection = (electionId) => api.get(`/anomalies/election/${electionId}`);
export const createAnomaly = (anomaly, electionId) => api.post(`/anomalies?electionId=${electionId}`, anomaly);
export const updateAnomalyStatus = (id, status) => api.put(`/anomalies/${id}/status`, { status });

// Reports
export const getReports = () => api.get('/reports');
export const createReport = (report, electionId) => {
    const url = electionId ? `/reports?electionId=${electionId}` : '/reports';
    return api.post(url, report);
};
export const deleteReport = (id) => api.delete(`/reports/${id}`);

// Discussions
export const getDiscussions = () => api.get('/discussions');
export const getDiscussionsByElection = (electionId) => api.get(`/discussions/election/${electionId}`);
export const createDiscussion = (discussion, electionId) => {
    const url = electionId ? `/discussions?electionId=${electionId}` : '/discussions';
    return api.post(url, discussion);
};
export const addReply = (parentId, reply) => api.post(`/discussions/${parentId}/replies`, reply);
export const deleteDiscussion = (id) => api.delete(`/discussions/${id}`);

// Admin
export const getUsers = () => api.get('/admin/users');
export const toggleUser = (id) => api.put(`/admin/users/${id}/toggle`, {});
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

export default api;
