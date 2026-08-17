import { apiRequest } from "./api";

export const getAllCampaigns = () => apiRequest("/campaigns");
export const getMyCampaigns = () => apiRequest("/campaigns/my");
export const getCampaignById = (id) => apiRequest(`/campaigns/${id}`);

export const createCampaign = (data) =>
    apiRequest("/campaigns", {
        method: "POST",
        body: JSON.stringify(data)
    });

export const updateCampaign = (id, data) =>
    apiRequest(`/campaigns/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
    });

export const deleteCampaign = (id) =>
    apiRequest(`/campaigns/${id}`, { method: "DELETE" });
