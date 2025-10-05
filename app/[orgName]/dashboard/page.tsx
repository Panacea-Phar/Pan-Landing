"use client";

import React, { useState, use, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import AuthGuard from "@/app/components/auth/AuthGuard";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/utils/api";

interface DashboardPageProps {
    params: {
        orgName: string;
    };
}

export default function DashboardPage({ params }: DashboardPageProps) {
    const { orgName } = use(params);
    const { user, organization, membership } = useAuth();
    const router = useRouter();
    const [memberCount, setMemberCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMemberCount();
    }, [orgName]);

    const fetchMemberCount = async () => {
        try {
            const queryParams = new URLSearchParams({ org_name: orgName });
            const response = await apiFetch<{ members: any[] }>(
                `/api/auth/members/?${queryParams}`,
            );
            setMemberCount(response.members?.length || 0);
        } catch (error) {
            console.error("Failed to fetch member count:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAction = (action: string) => {
        switch (action) {
            case "conversations":
                router.push(`/${orgName}/conversations`);
                break;
            case "settings":
                router.push(`/${orgName}/settings`);
                break;
            case "members":
                router.push(`/${orgName}/settings`);
                break;
            default:
                break;
        }
    };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">
                            Welcome back,{" "}
                            {user?.first_name || user?.email?.split("@")[0]}!
                        </h1>
                        <p className="text-slate-600 mt-2">
                            Here's what's happening at{" "}
                            {organization?.name || orgName} today.
                        </p>
                    </div>

                    {/* Stats Card */}
                    <div className="mb-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 mb-2">
                                        Team Members
                                    </p>
                                    <p className="text-4xl font-bold text-slate-900">
                                        {loading ? "..." : memberCount}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-2">
                                        Active in your organization
                                    </p>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 mb-6">
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Conversations */}
                            <button
                                onClick={() =>
                                    handleQuickAction("conversations")
                                }
                                className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-emerald-200 transition-all duration-300 text-left"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                                        <svg
                                            className="w-6 h-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                            />
                                        </svg>
                                    </div>
                                    <svg
                                        className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                    View Conversations
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Monitor active calls and fulfillment
                                    requests
                                </p>
                            </button>

                            {/* Settings */}
                            <button
                                onClick={() => handleQuickAction("settings")}
                                className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-emerald-200 transition-all duration-300 text-left"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl">
                                        <svg
                                            className="w-6 h-6 text-white"
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
                                    </div>
                                    <svg
                                        className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                    Organization Settings
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Manage your pharmacy details and team
                                </p>
                            </button>

                            {/* Help & Support */}
                            <button className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-emerald-200 transition-all duration-300 text-left">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                                        <svg
                                            className="w-6 h-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <svg
                                        className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                    Help & Support
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Get help with PanAI or contact support
                                </p>
                            </button>
                        </div>
                    </div>

                    {/* Status Banner */}
                    <div className="mt-12">
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        PanAI is active and monitoring calls
                                    </h3>
                                    <p className="text-emerald-100">
                                        Your pharmacy is ready to handle
                                        incoming patient requests 24/7
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium">
                                        Online
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
