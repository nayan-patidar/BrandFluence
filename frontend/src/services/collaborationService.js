import { apiRequest } from "./api";

export const applyToCampaign = (campaignId, message) =>
    apiRequest(`/collaborations/apply/${campaignId}`, {
        method: "POST",
        body: JSON.stringify({ message })
    });

export const getMyApplications = () => apiRequest("/collaborations/my");
export const getReceivedRequests = () => apiRequest("/collaborations/received");

export const acceptCollaboration = (id) =>
    apiRequest(`/collaborations/${id}/accept`, { method: "PUT" });

export const rejectCollaboration = (id) =>
    apiRequest(`/collaborations/${id}/reject`, { method: "PUT" });
