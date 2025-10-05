"use client";

import React, { useState, use, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";

interface LoginPageProps {
    params: {
        orgName: string;
    };
}

export default function LoginPage() {
    const params = useParams();

    const orgName = params?.orgName as string;
    const { login, isAuthenticated, isLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            router.push(`/${orgName}/dashboard`);
        }
    }, [isAuthenticated, isLoading, router, orgName]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email, password, orgName);
            // Navigation handled by login function
        } catch (err) {
            const errorMessage = (err as Error).message;
            setError(errorMessage);
            console.error("Login Failed:", err);
        } finally {
            setLoading(false);
        }
    };

    // Show loading spinner if checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand section */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <svg
                            className="w-10 h-10 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back
                    </h1>
                    <p className="text-gray-600">
                        Sign in to{" "}
                        <span className="font-semibold text-emerald-600">
                            {orgName}
                        </span>
                    </p>
                </div>

                {/* Login form */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    {/* Error Message Display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                            <div className="flex items-center">
                                <svg
                                    className="w-5 h-5 mr-2 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <p className="font-semibold">Login Error</p>
                                    <p className="text-sm mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition duration-200 disabled:bg-black disabled:text-black"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition duration-200 disabled:bg-black disabled:text-black"
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-600 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a
                                    href="#"
                                    className="font-medium text-emerald-600 hover:text-emerald-500 transition duration-200"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform hover:scale-[1.02] ${
                                loading
                                    ? "bg-emerald-400 cursor-not-allowed"
                                    : "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800"
                            }`}
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                <>
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
                                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    Sign in to {orgName}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Additional info */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                New to {orgName}?{" "}
                                <a
                                    href="#"
                                    className="font-medium text-emerald-600 hover:text-emerald-500 transition duration-200"
                                >
                                    Contact your administrator
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500">
                        Powered by{" "}
                        <span className="font-semibold text-emerald-600">
                            PanAI
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
