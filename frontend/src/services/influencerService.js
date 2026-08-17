import { apiRequest } from "./api";

export const getAllInfluencers = () => apiRequest("/influencers");
export const getInfluencerById = (id) => apiRequest(`/influencers/${id}`);
export const getMyInfluencerProfile = () => apiRequest("/influencers/my");

export const saveInfluencerProfile = (data) =>
    apiRequest("/influencers/profile", {
        method: "POST",
        body: JSON.stringify(data)
    });

export const searchInfluencers = (niche, city) => {
    const params = new URLSearchParams();
    if (niche) params.set("niche", niche);
    if (city) params.set("city", city);
    const query = params.toString();
    return apiRequest(`/influencers/search${query ? `?${query}` : ""}`);
};
