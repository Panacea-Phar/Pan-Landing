"use client";

import React, { useState, use, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import AuthGuard from "@/app/components/auth/AuthGuard";
import { apiFetch } from "@/app/utils/api";
import { useRouter, useParams } from "next/navigation";

interface Conversation {
    id: string;
    medication_s: string;
    caller_phone: string;
    call_in_at: string;
    call_out_at?: string;
    priority: string;
    fulfillment_type: string;
    patient: {
        name: string;
        email: string;
        phone?: string;
    };
}

interface Fulfillment {
    id: string;
    medication: string;
    description?: string;
    fulfillment_type: string;
    priority: string;
    patient?: {
        name: string;
        email: string;
    };
    conversation?: {
        caller_phone: string;
    };
    statuses: Array<{
        status: string;
        timestamp: string;
    }>;
}

export default function ConversationsPage() {
    // const router = useRouter();
    const params = useParams();

    const orgName = params?.orgName as string;

    const { organization } = useAuth();
    const [activeTab, setActiveTab] = useState<
        "conversations" | "fulfillments"
    >("conversations");
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [fulfillments, setFulfillments] = useState<Fulfillment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [orgName, activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const queryParams = new URLSearchParams({ org_name: orgName });

            if (activeTab === "conversations") {
                const response = await apiFetch<{ message: Conversation[] }>(
                    `/api/organization/active_conversation/?${queryParams}`,
                );
                setConversations(response.message || []);
            } else {
                const response = await apiFetch<{ message: Fulfillment[] }>(
                    `/api/organization/active_fulfillment/?${queryParams}`,
                );
                setFulfillments(response.message || []);
            }
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Failed to load data. Please try again.");
            // Set mock data for demonstration
            if (activeTab === "conversations") {
                setConversations([
                    {
                        id: "1",
                        medication_s: "Ibuprofen 200mg",
                        caller_phone: "+1234567890",
                        call_in_at: new Date(Date.now() - 300000).toISOString(),
                        priority: "medium",
                        fulfillment_type: "OTC",
                        patient: {
                            name: "John Doe",
                            email: "john@example.com",
                            phone: "+1234567890",
                        },
                    },
                    {
                        id: "2",
                        medication_s: "Prescription Refill - Metformin",
                        caller_phone: "+1987654321",
                        call_in_at: new Date(Date.now() - 900000).toISOString(),
                        priority: "high",
                        fulfillment_type: "PRESCRIPTION",
                        patient: {
                            name: "Jane Smith",
                            email: "jane@example.com",
                        },
                    },
                ]);
            } else {
                setFulfillments([
                    {
                        id: "1",
                        medication: "Ibuprofen 200mg",
                        description: "Pain relief medication",
                        fulfillment_type: "OTC",
                        priority: "medium",
                        patient: {
                            name: "John Doe",
                            email: "john@example.com",
                        },
                        conversation: {
                            caller_phone: "+1234567890",
                        },
                        statuses: [
                            {
                                status: "PENDING",
                                timestamp: new Date(
                                    Date.now() - 600000,
                                ).toISOString(),
                            },
                        ],
                    },
                ]);
            }
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60),
        );

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440)
            return `${Math.floor(diffInMinutes / 60)}h ago`;
        return date.toLocaleDateString();
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case "high":
                return "bg-red-100 text-red-800 border-red-200";
            case "medium":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "low":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getTypeColor = (type: string) => {
        switch (type.toUpperCase()) {
            case "PRESCRIPTION":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "OTC":
                return "bg-blue-100 text-blue-800 border-blue-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">
                            Patient Interactions
                        </h1>
                        <p className="text-slate-600 mt-2">
                            Monitor active conversations and fulfillment
                            requests for {organization?.name || orgName}
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="mb-8">
                        <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200 inline-flex">
                            <button
                                onClick={() => setActiveTab("conversations")}
                                className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                                    activeTab === "conversations"
                                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                }`}
                            >
                                <div className="flex items-center space-x-2">
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
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                    <span>Active Conversations</span>
                                    {conversations.length > 0 && (
                                        <span className="ml-2 bg-white/20 text-xs px-2 py-1 rounded-full">
                                            {conversations.length}
                                        </span>
                                    )}
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab("fulfillments")}
                                className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                                    activeTab === "fulfillments"
                                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                }`}
                            >
                                <div className="flex items-center space-x-2">
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
                                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                        />
                                    </svg>
                                    <span>Fulfillment Requests</span>
                                    {fulfillments.length > 0 && (
                                        <span className="ml-2 bg-white/20 text-xs px-2 py-1 rounded-full">
                                            {fulfillments.length}
                                        </span>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
                            <div className="flex">
                                <svg
                                    className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                            <span className="ml-2 text-slate-600">
                                Loading {activeTab}...
                            </span>
                        </div>
                    ) : (
                        <>
                            {/* Conversations Tab */}
                            {activeTab === "conversations" && (
                                <div className="space-y-4">
                                    {conversations.length === 0 ? (
                                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                                            <svg
                                                className="w-12 h-12 text-slate-400 mx-auto mb-4"
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
                                            <h3 className="text-lg font-medium text-slate-900 mb-2">
                                                No active conversations
                                            </h3>
                                            <p className="text-slate-600">
                                                All quiet! No patient calls at
                                                the moment.
                                            </p>
                                        </div>
                                    ) : (
                                        conversations.map((conversation) => (
                                            <div
                                                key={conversation.id}
                                                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-start space-x-4">
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
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <h3 className="text-lg font-semibold text-slate-900">
                                                                        {conversation
                                                                            .patient
                                                                            ?.name ||
                                                                            "Unknown Patient"}
                                                                    </h3>
                                                                    <div className="flex items-center space-x-2">
                                                                        <span
                                                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(conversation.priority)}`}
                                                                        >
                                                                            {conversation.priority
                                                                                .charAt(
                                                                                    0,
                                                                                )
                                                                                .toUpperCase() +
                                                                                conversation.priority.slice(
                                                                                    1,
                                                                                )}{" "}
                                                                            Priority
                                                                        </span>
                                                                        <span
                                                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(conversation.fulfillment_type)}`}
                                                                        >
                                                                            {
                                                                                conversation.fulfillment_type
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <p className="text-slate-600 mb-3 font-medium">
                                                                    {
                                                                        conversation.medication_s
                                                                    }
                                                                </p>
                                                                <div className="flex items-center justify-between text-sm text-slate-500">
                                                                    <div className="flex items-center space-x-4">
                                                                        <span>
                                                                            📞{" "}
                                                                            {
                                                                                conversation.caller_phone
                                                                            }
                                                                        </span>
                                                                        <span>
                                                                            ✉️{" "}
                                                                            {
                                                                                conversation
                                                                                    .patient
                                                                                    ?.email
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <span>
                                                                        Called{" "}
                                                                        {formatTime(
                                                                            conversation.call_in_at,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex items-center justify-end space-x-3">
                                                    <button className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors duration-200">
                                                        View Details
                                                    </button>
                                                    <button className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors duration-200">
                                                        Decline
                                                    </button>
                                                    <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 rounded-lg transition-all duration-200 shadow-sm">
                                                        Accept & Process
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Fulfillments Tab */}
                            {activeTab === "fulfillments" && (
                                <div className="space-y-4">
                                    {fulfillments.length === 0 ? (
                                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                                            <svg
                                                className="w-12 h-12 text-slate-400 mx-auto mb-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                                />
                                            </svg>
                                            <h3 className="text-lg font-medium text-slate-900 mb-2">
                                                No pending fulfillments
                                            </h3>
                                            <p className="text-slate-600">
                                                All fulfillment requests have
                                                been completed!
                                            </p>
                                        </div>
                                    ) : (
                                        fulfillments.map((fulfillment) => (
                                            <div
                                                key={fulfillment.id}
                                                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-start space-x-4">
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
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <h3 className="text-lg font-semibold text-slate-900">
                                                                        {fulfillment
                                                                            .patient
                                                                            ?.name ||
                                                                            "Unknown Patient"}
                                                                    </h3>
                                                                    <div className="flex items-center space-x-2">
                                                                        <span
                                                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(fulfillment.priority)}`}
                                                                        >
                                                                            {fulfillment.priority
                                                                                .charAt(
                                                                                    0,
                                                                                )
                                                                                .toUpperCase() +
                                                                                fulfillment.priority.slice(
                                                                                    1,
                                                                                )}{" "}
                                                                            Priority
                                                                        </span>
                                                                        <span
                                                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(fulfillment.fulfillment_type)}`}
                                                                        >
                                                                            {
                                                                                fulfillment.fulfillment_type
                                                                            }
                                                                        </span>
                                                                        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-orange-100 text-orange-800 border-orange-200">
                                                                            {fulfillment
                                                                                .statuses[0]
                                                                                ?.status ||
                                                                                "PENDING"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <p className="text-slate-600 mb-2 font-medium">
                                                                    {
                                                                        fulfillment.medication
                                                                    }
                                                                </p>
                                                                {fulfillment.description && (
                                                                    <p className="text-slate-500 text-sm mb-3">
                                                                        {
                                                                            fulfillment.description
                                                                        }
                                                                    </p>
                                                                )}
                                                                <div className="flex items-center justify-between text-sm text-slate-500">
                                                                    <div className="flex items-center space-x-4">
                                                                        {fulfillment
                                                                            .conversation
                                                                            ?.caller_phone && (
                                                                            <span>
                                                                                📞{" "}
                                                                                {
                                                                                    fulfillment
                                                                                        .conversation
                                                                                        .caller_phone
                                                                                }
                                                                            </span>
                                                                        )}
                                                                        <span>
                                                                            ✉️{" "}
                                                                            {
                                                                                fulfillment
                                                                                    .patient
                                                                                    ?.email
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    {fulfillment
                                                                        .statuses[0] && (
                                                                        <span>
                                                                            Updated{" "}
                                                                            {formatTime(
                                                                                fulfillment
                                                                                    .statuses[0]
                                                                                    .timestamp,
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex items-center justify-end space-x-3">
                                                    <button className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors duration-200">
                                                        View Details
                                                    </button>
                                                    <button className="px-4 py-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg transition-colors duration-200">
                                                        Mark In Progress
                                                    </button>
                                                    <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 rounded-lg transition-all duration-200 shadow-sm">
                                                        Complete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}
