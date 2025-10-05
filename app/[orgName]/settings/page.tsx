"use client";

import React, { useState, use, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import AuthGuard from "@/app/components/auth/AuthGuard";
import { apiFetch } from "@/app/utils/api";

interface SettingsPageProps {
    params: {
        orgName: string;
    };
}

interface OrganizationSettings {
    id: string;
    name: string;
    phone_number: string;
    email: string;
    website: string;
    description: string;
    street_address: string;
    street_address_2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
}

interface Member {
    id: string;
    user: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
    };
    role: string;
    created_at: string;
}

export default function SettingsPage({ params }: SettingsPageProps) {
    const { orgName } = use(params);
    const { user, organization, membership } = useAuth();
    const [activeTab, setActiveTab] = useState("organization");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Organization settings state
    const [orgSettings, setOrgSettings] = useState<OrganizationSettings>({
        id: "",
        name: "",
        phone_number: "",
        email: "",
        website: "",
        description: "",
        street_address: "",
        street_address_2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
    });

    // Members state
    const [members, setMembers] = useState<Member[]>([]);
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [newMemberRole, setNewMemberRole] = useState("member");

    const isAdmin = membership?.role?.toLowerCase() === "admin";

    useEffect(() => {
        if (organization) {
            setOrgSettings({
                id: organization.id,
                name: organization.name || "",
                phone_number: organization.phone_number || "",
                email: organization.email || "",
                website: "",
                description: "",
                street_address: "",
                street_address_2: "",
                city: "",
                state: "",
                postal_code: "",
                country: "",
            });
        }
        fetchMembers();
        console.log("m", members);
    }, [organization]);

    const fetchMembers = async () => {
        try {
            const queryParams = new URLSearchParams({ org_name: orgName });
            const response = await apiFetch<{ members: Member[] }>(
                `/api/auth/members/?${queryParams}`,
            );
            setMembers(response.members || []);
        } catch (err) {
            console.error("Failed to fetch members:", err);
        }
    };

    const fetchOrganizationSettings = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({ org_name: orgName });
            const response = await apiFetch<{ pharmacy: OrganizationSettings }>(
                `/api/auth/settings/?${queryParams}`,
            );
            if (response.pharmacy) {
                setOrgSettings(response.pharmacy);
            }
        } catch (err) {
            console.error("Failed to fetch organization settings:", err);
            setError("Failed to load organization settings");
        } finally {
            setLoading(false);
        }
    };

    const saveOrganizationSettings = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            const queryParams = new URLSearchParams({ org_name: orgName });
            await apiFetch(`/api/auth/settings/?${queryParams}`, {
                method: "POST",
                body: {
                    phoneNumber: orgSettings.phone_number,
                    email: orgSettings.email,
                    website: orgSettings.website,
                    description: orgSettings.description,
                    streetAddress: orgSettings.street_address,
                    city: orgSettings.city,
                    state: orgSettings.state,
                    postalCode: orgSettings.postal_code,
                    country: orgSettings.country,
                },
            });

            setSuccess("Organization settings updated successfully!");
        } catch (err) {
            console.error("Failed to save settings:", err);
            setError("Failed to save settings. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const addMember = async () => {
        if (!newMemberEmail.trim()) return;

        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            const queryParams = new URLSearchParams({ org_name: orgName });
            await apiFetch(`/api/auth/members/?${queryParams}`, {
                method: "POST",
                body: {
                    newUser: {
                        email: newMemberEmail,
                        role: newMemberRole,
                    },
                },
            });

            setNewMemberEmail("");
            setNewMemberRole("member");
            setSuccess("Member added successfully!");
            fetchMembers();
        } catch (err) {
            console.error("Failed to add member:", err);
            setError("Failed to add member. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (
        field: keyof OrganizationSettings,
        value: string,
    ) => {
        setOrgSettings((prev) => ({ ...prev, [field]: value }));
    };

    const tabs = [
        { id: "organization", name: "Organization", icon: "🏢" },
        { id: "members", name: "Members", icon: "👥", adminOnly: false },
        { id: "security", name: "Security", icon: "🔒", adminOnly: true },
    ];

    const filteredTabs = tabs.filter((tab) => !tab.adminOnly || isAdmin);

    return (
        <AuthGuard requiresAuth={true}>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Settings
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage your organization settings and preferences
                        </p>
                    </div>

                    {/* Alert Messages */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
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

                    {success && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
                            <div className="flex">
                                <svg
                                    className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p className="text-sm text-green-700">
                                    {success}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Navigation */}
                        <div className="w-full lg:w-64 flex-shrink-0">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                <nav className="p-2">
                                    {filteredTabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                                                activeTab === tab.id
                                                    ? "bg-indigo-50 text-emerald-700 border-indigo-200"
                                                    : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span className="text-lg">
                                                {tab.icon}
                                            </span>
                                            <span className="font-medium">
                                                {tab.name}
                                            </span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                {/* Organization Settings */}
                                {activeTab === "organization" && (
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                Organization Settings
                                            </h2>
                                            {isAdmin && (
                                                <button
                                                    onClick={
                                                        saveOrganizationSettings
                                                    }
                                                    disabled={saving}
                                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                >
                                                    {saving
                                                        ? "Saving..."
                                                        : "Save Changes"}
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-6">
                                            {/* Basic Information */}
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                    Basic Information
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Organization Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                orgSettings.name
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    "name",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={!isAdmin}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Phone Number
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            value={
                                                                orgSettings.phone_number
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    "phone_number",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={!isAdmin}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Email Address
                                                        </label>
                                                        <input
                                                            type="email"
                                                            value={
                                                                orgSettings.email
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    "email",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={!isAdmin}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Website
                                                        </label>
                                                        <input
                                                            type="url"
                                                            value={
                                                                orgSettings.website
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    "website",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={!isAdmin}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Description
                                                </label>
                                                <textarea
                                                    value={
                                                        orgSettings.description
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "description",
                                                            e.target.value,
                                                        )
                                                    }
                                                    disabled={!isAdmin}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                                                    placeholder="Brief description of your organization"
                                                />
                                            </div>

                                            {/* Address */}
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                    Address Information
                                                </h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Street Address
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                orgSettings.street_address
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    "street_address",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={!isAdmin}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                City
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    orgSettings.city
                                                                }
                                                                onChange={(e) =>
                                                                    handleInputChange(
                                                                        "city",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                disabled={
                                                                    !isAdmin
                                                                }
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                State/Province
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    orgSettings.state
                                                                }
                                                                onChange={(e) =>
                                                                    handleInputChange(
                                                                        "state",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                disabled={
                                                                    !isAdmin
                                                                }
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Postal Code
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    orgSettings.postal_code
                                                                }
                                                                onChange={(e) =>
                                                                    handleInputChange(
                                                                        "postal_code",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                disabled={
                                                                    !isAdmin
                                                                }
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Country
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    orgSettings.country
                                                                }
                                                                onChange={(e) =>
                                                                    handleInputChange(
                                                                        "country",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                disabled={
                                                                    !isAdmin
                                                                }
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {!isAdmin && (
                                            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <p className="text-sm text-yellow-800">
                                                    You dont have permission to
                                                    edit organization settings.
                                                    Contact an administrator to
                                                    make changes.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Members Management */}
                                {activeTab === "members" && (
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                Team Members
                                            </h2>
                                        </div>

                                        {/* Add Member Form (Admin Only) */}
                                        {isAdmin && (
                                            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                    Add New Member
                                                </h3>
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <input
                                                        type="email"
                                                        value={newMemberEmail}
                                                        onChange={(e) =>
                                                            setNewMemberEmail(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Email address"
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                    />
                                                    <select
                                                        value={newMemberRole}
                                                        onChange={(e) =>
                                                            setNewMemberRole(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                    >
                                                        <option value="member">
                                                            Member
                                                        </option>
                                                        <option value="admin">
                                                            Admin
                                                        </option>
                                                    </select>
                                                    <button
                                                        onClick={addMember}
                                                        disabled={
                                                            saving ||
                                                            !newMemberEmail.trim()
                                                        }
                                                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                    >
                                                        {saving
                                                            ? "Adding..."
                                                            : "Add Member"}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {members.length === 0 && (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500">
                                                    No members found.
                                                </p>
                                            </div>
                                        )}

                                        {/* Members List */}
                                        <div className="space-y-4">
                                            {members.map((member) => (
                                                <div
                                                    key={member.id}
                                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                            <span className="text-sm font-medium text-emerald-600">
                                                                {
                                                                    member.user
                                                                        .email
                                                                }
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {
                                                                    member.user
                                                                        .first_name
                                                                }{" "}
                                                                {
                                                                    member.user
                                                                        .last_name
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {
                                                                    member.user
                                                                        .email
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-emerald-800 capitalize">
                                                            {member.role.toLowerCase()}
                                                        </span>
                                                        <p className="text-xs text-gray-500">
                                                            Joined{" "}
                                                            {new Date(
                                                                member.created_at,
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Security Settings */}
                                {activeTab === "security" && isAdmin && (
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                            Security Settings
                                        </h2>

                                        <div className="space-y-6">
                                            <div className="p-4 border border-gray-200 rounded-lg">
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                    Password Policy
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    Configure password
                                                    requirements for your
                                                    organization.
                                                </p>
                                                <div className="space-y-3">
                                                    <label className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">
                                                            Require minimum 8
                                                            characters
                                                        </span>
                                                    </label>
                                                    <label className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">
                                                            Require uppercase
                                                            letters
                                                        </span>
                                                    </label>
                                                    <label className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">
                                                            Require special
                                                            characters
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="p-4 border border-gray-200 rounded-lg">
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                    Session Management
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    Control how user sessions
                                                    are managed.
                                                </p>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Session Timeout
                                                            (minutes)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            defaultValue={60}
                                                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
