"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch, setAuthToken, clearAuthToken } from "@/app/utils/api";

interface User {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
}

interface Organization {
    id: string;
    name: string;
    phone_number?: string;
    type: string;
    email?: string;
    website?: string;
    description?: string;
    street_address?: string;
    street_address_2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
}

interface Membership {
    role: string;
    organization: Organization;
    user: User;
}

interface AuthContextType {
    user: User | null;
    membership: Membership | null;
    organization: Organization | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string, orgName: string) => Promise<void>;
    logout: () => void;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [membership, setMembership] = useState<Membership | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const orgName = params?.orgName as string;

    const isAuthenticated = !!user && !!membership;

    const logout = useCallback(() => {
        setUser(null);
        setMembership(null);
        setOrganization(null);
        clearAuthToken();
        if (orgName) {
            router.push(`/${orgName}/login`);
        } else {
            router.push("/");
        }
    }, [router, orgName]);

    const login = async (email: string, password: string, orgName: string) => {
        try {
            setIsLoading(true);

            const queryParams = new URLSearchParams({ orgName });
            const response = await apiFetch<{ token: string }>(
                `/api/auth/login/?${queryParams}`,
                {
                    method: "POST",
                    body: { email, password },
                },
            );

            if (response.token) {
                setAuthToken(response.token);
                await refreshAuth();
                router.push(`/${orgName}/dashboard`);
            } else {
                throw new Error("No token received from server");
            }
        } catch (error) {
            console.error("🔴 Login failed:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const refreshAuth = async () => {
        try {
            setIsLoading(true);

            if (!orgName) {
                return;
            }

            // Fetch user profile and membership info
            const queryParams = new URLSearchParams({ org_name: orgName });
            const membershipResponse = await apiFetch<{
                members: Membership[];
            }>(`/api/auth/members/?${queryParams}`, {
                method: "GET",
            });
            const settingsResponse = await apiFetch<{ settings: Organization }>(
                `/api/auth/settings/?${queryParams}`,
                {
                    method: "GET",
                },
            );

            // Get current user's membership from the members list
            // This is a simplified approach - you might want to add a dedicated endpoint for current user info
            const token = localStorage.getItem("authToken");
            if (
                token &&
                membershipResponse.members &&
                membershipResponse.members.length > 0
            ) {
                // For now, we'll assume the first member is the current user
                // In a real app, you'd decode the JWT token or have a separate endpoint
                const currentMembership = membershipResponse.members[0];
                const organization = settingsResponse.settings;

                setMembership(currentMembership);
                setUser(currentMembership.user);
                setOrganization(organization);
            }
        } catch (error) {
            console.error("Failed to refresh auth:", error);
            if (error instanceof Error && (error as any).status === 401) {
                logout();
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Check authentication on mount and org change
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token && orgName) {
            refreshAuth();
        } else {
            setIsLoading(false);
        }
    }, [orgName]);

    // Auto-logout if token is removed
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "authToken" && !e.newValue) {
                logout();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [logout]);

    const contextValue: AuthContextType = {
        user,
        membership,
        organization,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshAuth,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
