import { apiRequest } from "./api";

export async function registerUser(userData) {
    return apiRequest("/users/register", {
        method: "POST",
        body: JSON.stringify(userData)
    });
}

export async function loginUser(credentials) {
    const response = await apiRequest("/users/login", {
        method: "POST",
        body: JSON.stringify(credentials)
    });

    localStorage.setItem("token", response.token);

    localStorage.setItem(
        "user",
        JSON.stringify({
            id: response.id,
            name: response.name,
            email: response.email,
            role: response.role
        })
    );

    return response;
}

export function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

export function getCurrentUser() {
    const user = localStorage.getItem("user");

    return user ? JSON.parse(user) : null;
}

export function getToken() {
    return localStorage.getItem("token");
}

export function isAuthenticated() {
    return !!localStorage.getItem("token");
}   