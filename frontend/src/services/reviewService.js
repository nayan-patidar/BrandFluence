import { apiRequest } from "./api";

export const createReview = (data) =>
    apiRequest("/reviews", {
        method: "POST",
        body: JSON.stringify(data)
    });

export const getInfluencerReviews = (influencerId) =>
    apiRequest(`/reviews/influencer/${influencerId}`);
