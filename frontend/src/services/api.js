const API_BASE_URL = "http://localhost:8080/api";

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    const contentType = response.headers.get("content-type");

    let data;

    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {
        throw new Error(
            typeof data === "string"
                ? data
                : data.message || "Something went wrong"
        );
    }

    return data;
}

export { API_BASE_URL };