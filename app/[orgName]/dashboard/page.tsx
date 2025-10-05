"use client";

import React from "react";
import { AuthProvider } from "@/app/contexts/AuthContext";
import AuthGuard from "@/app/components/auth/AuthGuard";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";

interface OrgLayoutProps {
    children: React.ReactNode;
}

// Navigation component that uses auth context
const OrgNavigation: React.FC = () => {
    const { user, organization, membership, logout } = useAuth();
    const router = useRouter();
    const params = useParams();
    const orgName = params?.orgName as string;

    const navigationItems = [
        {
            name: "Dashboard",
            href: `/${orgName}/dashboard`,
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                </svg>
            ),
        },
        {
            name: "Settings",
            href: `/${orgName}/settings`,
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            ),
            requiresRole: ["admin", "manager"],
        },
    ];

    const handleNavigation = (href: string) => {
        router.push(href);
    };

    const handleLogout = () => {
        logout();
    };

    // Filter navigation items based on user role
    const filteredNavItems = navigationItems.filter((item) => {
        if (!item.requiresRole) return true;
        const userRole = membership?.role?.toLowerCase();
        return item.requiresRole.some(
            (role) => role.toLowerCase() === userRole,
        );
    });

    return (
        <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Organization branding */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-bold text-gray-900">
                                {organization?.name || orgName}
                            </h1>
                        </div>

                        {/* Navigation items */}
                        <nav className="hidden md:ml-8 md:flex md:space-x-8">
                            {filteredNavItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigation(item.href)}
                                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* User menu */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="text-sm">
                                <div className="font-medium text-gray-900">
                                    {user?.first_name ||
                                        user?.email?.split("@")[0]}
                                </div>
                                <div className="text-xs text-gray-500 capitalize">
                                    {membership?.role?.toLowerCase()}
                                </div>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Conditional navigation wrapper
const ConditionalNavigation: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // Don't show navigation if still loading or not authenticated
    if (isLoading || !isAuthenticated) {
        return null;
    }

    return <OrgNavigation />;
};

// Main layout component
export default function OrgLayout({ children }: OrgLayoutProps) {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-gray-50">
                {/* Navigation - conditionally render based on authentication */}
                <ConditionalNavigation />

                {/* Main content */}
                <main className="flex-1">{children}</main>
            </div>
        </AuthProvider>
    );
}
