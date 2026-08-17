import { apiRequest } from "./api";

export const getAllUsers = () => apiRequest("/users/all");
