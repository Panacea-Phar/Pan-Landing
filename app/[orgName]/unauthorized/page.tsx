"use client";

import React, { use } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

interface UnauthorizedPageProps {
    params: {
        orgName: string;
    };
}

export default function UnauthorizedPage() {
    const params = useParams();

    const orgName = params?.orgName as string;
    const { user, membership, logout } = useAuth();
    const router = useRouter();

    const handleGoBack = () => {
        router.push(`/${orgName}/dashboard`);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                </div>

                <div className="mt-8 bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Access Denied
                        </h1>
                        <p className="text-gray-600 mb-6">
                            You dont have the required permissions to access
                            this page.
                        </p>

                        {user && membership && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center">
                                    <svg
                                        className="w-5 h-5 text-yellow-400 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <div className="text-left">
                                        <p className="text-sm text-yellow-800">
                                            <strong>Current Role:</strong>{" "}
                                            <span className="capitalize">
                                                {membership.role.toLowerCase()}
                                            </span>
                                        </p>
                                        <p className="text-xs text-yellow-600 mt-1">
                                            Contact an administrator to request
                                            access to this feature.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <button
                                onClick={handleGoBack}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Go to Dashboard
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
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
                                Sign Out
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                                Need help? Contact your system administrator or
                                check the user guide for more information about
                                user roles and permissions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
