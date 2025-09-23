"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import { submitSalesForm, SalesFormData } from "../../lib/supabase";

export default function SalesForm() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        decisionMaker: "",
        pharmacyName: "",
        pharmacyAddress: "",
        pharmacyCity: "",
        pharmacyState: "",
        pharmacyZip: "",
        pharmacySize: "",
        notes: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string>("");

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!form.firstName.trim())
            newErrors.firstName = "First name is required";
        if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!form.email.trim()) newErrors.email = "Email is required";
        if (!form.role) newErrors.role = "Role selection is required";
        if (!form.decisionMaker)
            newErrors.decisionMaker = "Decision maker status is required";
        if (!form.pharmacyName.trim())
            newErrors.pharmacyName = "Pharmacy name is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitError("");

        try {
            // Convert form data to match Supabase schema
            const supabaseData: Omit<
                SalesFormData,
                "id" | "created_at" | "updated_at"
            > = {
                first_name: form.firstName,
                last_name: form.lastName,
                email: form.email,
                phone: form.phone ?? null,
                role: form.role,
                decision_maker: form.decisionMaker,
                pharmacy_name: form.pharmacyName,
                pharmacy_address: form.pharmacyAddress ?? null,
                pharmacy_city: form.pharmacyCity ?? null,
                pharmacy_state: form.pharmacyState ?? null,
                pharmacy_zip: form.pharmacyZip ?? null,
                pharmacy_size: form.pharmacySize ?? null,
                notes: form.notes ?? null,
            };

            await submitSalesForm(supabaseData);

            setSubmitSuccess(true);
            // Reset form
            setForm({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                role: "",
                decisionMaker: "",
                pharmacyName: "",
                pharmacyAddress: "",
                pharmacyCity: "",
                pharmacyState: "",
                pharmacyZip: "",
                pharmacySize: "",
                notes: "",
            });
            setErrors({});
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error submitting form:", error.message);
                setSubmitError(
                    error.message || "Failed to submit form. Please try again.",
                );
            } else {
                setSubmitError("Failed to submit form. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Talk to Sales
                        </h1>
                        <p className="mt-4 text-lg text-slate-600">
                            {
                                "Share a few details and our team will reach out with next steps. \
                                We'll help you get PanAI set up for your pharmacy in no time."
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    {submitSuccess ? (
                        <div className="rounded-xl bg-emerald-50 p-8 text-center shadow-lg ring-1 ring-emerald-200">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 mb-4">
                                <svg
                                    className="h-6 w-6 text-emerald-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m4.5 12.75 6 6 9-13.5"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-emerald-900 mb-4">
                                Thank you for your submission!
                            </h2>
                            <p className="text-emerald-700 mb-6">
                                {
                                    "We've received your information and our sales \
                                    team will contact you within 1 business day."
                                }
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => setSubmitSuccess(false)}
                                    className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-base font-semibold text-white hover:bg-emerald-700 transition-all duration-200"
                                >
                                    Submit Another Form
                                </button>
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-emerald-600 ring-1 ring-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                                >
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            {submitError && (
                                <div className="mb-6 rounded-xl bg-red-50 p-4 shadow-sm ring-1 ring-red-200">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="h-5 w-5 text-red-400"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-800">
                                                {submitError}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Contact Information */}
                                <div className="rounded-xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
                                    <h2 className="text-lg font-semibold text-slate-900 mb-6">
                                        Contact Information
                                    </h2>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="firstName"
                                                className="block text-sm font-medium text-slate-700 mb-2"
                                            >
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                id="firstName"
                                                required
                                                value={form.firstName}
                                                onChange={handleChange}
                                                className={`block w-full rounded-lg border-2 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-500 shadow-sm focus:outline-none transition-all duration-200 hover:border-slate-400 ${
                                                    errors.firstName
                                                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                                        : "border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                                }`}
                                                placeholder="Enter your first name"
                                            />
                                            {errors.firstName && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.firstName}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="lastName"
                                                className="block text-sm font-medium text-slate-700 mb-2"
                                            >
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                id="lastName"
                                                required
                                                value={form.lastName}
                                                onChange={handleChange}
                                                className={`block w-full rounded-lg border-2 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-500 shadow-sm focus:outline-none transition-all duration-200 hover:border-slate-400 ${
                                                    errors.lastName
                                                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                                        : "border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                                }`}
                                                placeholder="Enter your last name"
                                            />
                                            {errors.lastName && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.lastName}
                                                </p>
                                            )}
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium text-slate-700 mb-2"
                                            >
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                required
                                                value={form.email}
                                                onChange={handleChange}
                                                className={`block w-full rounded-lg border-2 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-500 shadow-sm focus:outline-none transition-all duration-200 hover:border-slate-400 ${
                                                    errors.email
                                                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                                        : "border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                                }`}
                                                placeholder="Enter your email address"
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label
                                                htmlFor="phone"
                                                className="block text-sm font-medium text-slate-700 mb-2"
                                            >
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                id="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                className="block w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-500 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200 hover:border-slate-400"
                                                placeholder="(555) 123-4567"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Role & Decision Making */}
                                <div className="rounded-xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
                                    <h2 className="text-lg font-semibold text-slate-900 mb-6">
                                        Your Role
                                    </h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label
                                                htmlFor="role"
                                                className="block text-sm font-medium text-slate-700 mb-2"
                                            >
                                                What is your role? *
                                            </label>
                                            <select
                                                name="role"
                                                id="role"
                                                required
                                                value={form.role}
                                                onChange={handleChange}
                                                className={`block w-full rounded-lg border-2 bg-white px-4 py-3 text-base text-slate-900 shadow-sm focus:outline-none transition-all duration-200 hover:border-slate-400 ${
                                                    errors.role
                                                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                                        : "border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                                }`}
                                            >
                                                <option value="">
                                                    Select your role
                                                </option>
                                                <option value="owner">
                                                    Pharmacy Owner
                                                </option>
                                                <option value="pharmacist">
                                                    Pharmacist
                                                </option>
                                                <option value="tech">
                                                    Pharmacy Technician
                                                </option>
                                                <option value="admin">
                                                    Administrator
                                                </option>
                                                <option value="manager">
                                                    Manager
                                                </option>
                                                <option value="other">
                                                    Other
                                                </option>
                                            </select>
                                            {errors.role && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.role}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="decisionMaker"
                                                className="block text-sm font-medium text-slate-700 mb-2"
                                            >
                                                Are you a decision maker? *
                                            </label>
                                            <select
                                                name="decisionMaker"
                                                id="decisionMaker"
                                                required
                                                value={form.decisionMaker}
                                                onChange={handleChange}
                                                className={`block w-full rounded-lg border-2 bg-white px-4 py-3 text-base text-slate-900 shadow-sm focus:outline-none transition-all duration-200 hover:border-slate-400 ${
                                                    errors.decisionMaker
                                                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                                        : "border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                                }`}
                                            >
                                                <option value="">
                                                    Select an option
                                                </option>
                                                <option value="yes">
                                                    Yes — I make purchasing
                                                    decisions
                                                </option>
                                                <option value="influence">
                                                    I have significant influence
                                                    on purchasing decisions
                                                </option>
                                                <option value="no">
                                                    {
                                                        "No — I'll refer this to the \
                                                        right person"
                                                    }
                                                </option>
                                            </select>
                                            {errors.decisionMaker && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.decisionMaker}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Pharmacy Information */}
                                <div className="rounded-xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
                                    <h2 className="text-lg font-semibold text-slate-900 mb-6">
                                        Pharmacy Information
                                    </h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label
                                                htmlFor="pharmacyName"
                                                className="block text-sm font-medium text-slate-700 mb-2"
                                            >
                                                Pharmacy Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="pharmacyName"
                                                id="pharmacyName"
                                                required
                                                value={form.pharmacyName}
                                                onChange={handleChange}
                                                className={`block w-full rounded-lg border-2 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-500 shadow-sm focus:outline-none transition-all duration-200 hover:border-slate-400 ${
                                                    errors.pharmacyName
                                                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                                        : "border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                                }`}
                                                placeholder="Enter your pharmacy name"
                                            />
                                            {errors.pharmacyName && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.pharmacyName}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="pharmacyAddress"
                                                className="block text-sm font-medium text-slate-700 mb-2"
                                            >
                                                Street Address
                                            </label>
                                            <input
                                                type="text"
                                                name="pharmacyAddress"
                                                id="pharmacyAddress"
                                                value={form.pharmacyAddress}
                                                onChange={handleChange}
                                                className="block w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-500 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200 hover:border-slate-400"
                                                placeholder="123 Main Street"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                            <div>
                                                <label
                                                    htmlFor="pharmacyCity"
                                                    className="block text-sm font-medium text-slate-700 mb-2"
                                                >
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    name="pharmacyCity"
                                                    id="pharmacyCity"
                                                    value={form.pharmacyCity}
                                                    onChange={handleChange}
                                                    className="block w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-500 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200 hover:border-slate-400"
                                                    placeholder="City"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="pharmacyState"
                                                    className="block text-sm font-medium text-slate-700 mb-2"
                                                >
                                                    State
                                                </label>
                                                <input
                                                    type="text"
                                                    name="pharmacyState"
                                                    id="pharmacyState"
                                                    value={form.pharmacyState}
                                                    onChange={handleChange}
                                                    className="block w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-500 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200 hover:border-slate-400"
                                                    placeholder="State"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="pharmacyZip"
                                                    className="block text-sm font-medium text-slate-700 mb-2"
                                                >
                                                    ZIP Code
                                                </label>
                                                <input
                                                    type="text"
                                                    name="pharmacyZip"
                                                    id="pharmacyZip"
                                                    value={form.pharmacyZip}
                                                    onChange={handleChange}
                                                    className="block w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-500 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200 hover:border-slate-400"
                                                    placeholder="12345"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="pharmacySize"
                                                className="block text-sm font-medium text-slate-700 mb-2"
                                            >
                                                Pharmacy Size
                                            </label>
                                            <select
                                                name="pharmacySize"
                                                id="pharmacySize"
                                                value={form.pharmacySize}
                                                onChange={handleChange}
                                                className="block w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200 hover:border-slate-400"
                                            >
                                                <option value="">
                                                    Select pharmacy size
                                                </option>
                                                <option value="independent">
                                                    Independent Pharmacy
                                                </option>
                                                <option value="small-chain">
                                                    Small Chain (2-10 locations)
                                                </option>
                                                <option value="regional-chain">
                                                    Regional Chain (11-50
                                                    locations)
                                                </option>
                                                <option value="large-chain">
                                                    Large Chain (50+ locations)
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div className="rounded-xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
                                    <h2 className="text-lg font-semibold text-slate-900 mb-6">
                                        Additional Information
                                    </h2>

                                    <div>
                                        <label
                                            htmlFor="notes"
                                            className="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Tell us more about your needs
                                        </label>
                                        <textarea
                                            name="notes"
                                            id="notes"
                                            rows={5}
                                            value={form.notes}
                                            onChange={handleChange}
                                            className="block w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-500 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200 resize-none hover:border-slate-400"
                                            placeholder="What challenges are you facing? What features are most important to you? Any specific questions about PanAI?"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center pt-8">
                                    <div className="flex flex-col items-center space-y-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-12 py-4 text-lg font-semibold text-white shadow-lg hover:bg-emerald-700 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                                        >
                                            {isSubmitting ? (
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
                                                    Submitting...
                                                </>
                                            ) : (
                                                "Submit Request"
                                            )}
                                        </button>

                                        <p className="text-sm text-slate-500 text-center max-w-md">
                                            By submitting this form, you agree
                                            to our privacy policy. Our team will
                                            contact you within 1 business day.
                                        </p>

                                        <Link
                                            href="/"
                                            className="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200"
                                        >
                                            ← Back to Home
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
