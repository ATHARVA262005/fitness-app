import axios from "axios";

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL:API_URL
});

api.interceptors.request.use((config) => {
    let userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        if (!userId || userId === "0" || userId === "null" || userId === "undefined") {
            try {
                const payloadBase64 = token.split('.')[1];
                if (payloadBase64) {
                    const payload = JSON.parse(atob(payloadBase64));
                    if (payload && payload.sub) {
                        userId = payload.sub;
                        localStorage.setItem('userId', userId);
                    }
                }
            } catch (e) {
                console.error("Failed to parse token payload in api interceptor:", e);
            }
        }
    }

    if (userId && userId !== "0" && userId !== "null" && userId !== "undefined") {
        config.headers['X-User-ID'] = userId;
    }
    return config;
});



export const getActivities = () => api.get('/activities');
export const getActivityById = (id) => api.get(`/activities/${id}`);
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivityRecommendation = (id) => api.get(`/recommendations/activity/${id}`);
export const getUserRecommendations = (userId) => api.get(`/recommendations/user/${userId}`);