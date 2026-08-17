import { apiRequest } from "./api";

export const getAllUsers = () =>
    apiRequest("/users/all");

export const deleteUser = (id) =>
    apiRequest(`/users/${id}`, {
        method: "DELETE",
    });