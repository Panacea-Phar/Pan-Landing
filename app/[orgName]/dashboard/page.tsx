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

interface Membership {
    role: string;
    organization: Organization;
    user: User;
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
            const response = await apiFetch<{ members: Membership[] }>(
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
                            Welcome back,
                            {user?.first_name || user?.email?.split("@")[0]}!
                        </h1>
                        <p className="text-slate-600 mt-2">
                            Here's what's happening at
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
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-
                                    ""

                                    ""
