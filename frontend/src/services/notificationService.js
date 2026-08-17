import { apiRequest } from "./api";

export const getMyNotifications = () => apiRequest("/notifications/my");

export const markNotificationAsRead = (id) =>
    apiRequest(`/notifications/${id}/read`, { method: "PUT" });
