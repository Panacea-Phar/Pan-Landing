export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"; // Replace with your actual backend URL
const TOKEN_STORAGE_KEY = "authToken";

const getAuthToken = (): string | null => {
    // Production Best Practice: Use HTTP-Only cookies to store the JWT token
    // to protect against XSS attacks.
    if (typeof window !== "undefined") {
        return localStorage.getItem(TOKEN_STORAGE_KEY);
    }
    return null;
};

export const setAuthToken = (token: string): void => {
    if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
};

export const clearAuthToken = (): void => {
    if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        window.location.href = "/login";
    }
};

interface ApiOptions extends RequestInit {
    // 'body' is used for POST/PUT and is typed to 'any' for flexibility,
    // but it should typically be a serializable object.
    body?: any;
}

export async function apiFetch<T>(
    endpoint: string,
    options: ApiOptions = {},
): Promise<T> {
    const token = getAuthToken();
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Token ${token}`; // Token for authenticated requests, most of them should be authenticated
    }

    let requestBody: string | undefined;
    if (options.body && options.method !== "GET" && options.method !== "HEAD") {
        try {
            requestBody = JSON.stringify(options.body);
        } catch (error) {
            console.error("Failed to stringify request body:", error);
            throw new Error("Invalid request body format.");
        }
    }

    const response = await fetch(url, {
        ...options,
        headers,
        body: requestBody,
    });

    if (!response.ok) {
        if (response.status === 401) {
            console.error(
                "401 Unauthorized. Clearing token and redirecting to login.",
            );
            clearAuthToken();
        }

        let errorDetails: any = null;
        try {
            errorDetails = await response.json();
        } catch (parseError) {}

        const errorMessage =
            errorDetails?.error ||
            errorDetails?.message ||
            `API Request Failed: ${response.status} ${response.statusText}`;

        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).details = errorDetails;

        throw error;
    }

    if (response.status === 204) {
        return {} as T;
    }

    try {
        return await response.json();
    } catch (error) {
        console.error("Failed to parse JSON response:", error);
        throw new Error("Invalid JSON response from server.");
    }
}

export function get<T>(endpoint: string): Promise<T> {
    return apiFetch<T>(endpoint, { method: "GET" });
}

export function post<T>(endpoint: string, data: any): Promise<T> {
    return apiFetch<T>(endpoint, { method: "POST", body: data });
}

export function put<T>(endpoint: string, data: any): Promise<T> {
    return apiFetch<T>(endpoint, { method: "PUT", body: data });
}

export function del<T>(endpoint: string): Promise<T> {
    return apiFetch<T>(endpoint, { method: "DELETE" });
}

interface UserProfile {
    id: number;
    name: string;
    email: string;
}

export async function fetchUserProfile(): Promise<UserProfile> {
    try {
        const profile = await get<UserProfile>("/users/profile");
        console.log("Profile fetched:", profile);
        return profile;
    } catch (error) {
        console.error("Error fetching profile:", (error as Error).message);
        throw error;
    }
}

interface LoginResponse {
    token: string;
    user: UserProfile;
}

export async function login(credentials: {
    username: string;
    password: string;
}): Promise<UserProfile> {
    const response = await post<LoginResponse>("/auth/login", credentials);
    setAuthToken(response.token);
    return response.user;
}
