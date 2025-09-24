"use client";

import Link from "next/link";
import Navbar from "./Navbar";

export default function LandingPage(): React.JSX.Element {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 sm:py-32">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-16 lg:grid-cols-2 lg:gap-8 items-center">
                        {/* Left Column - Content */}
                        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
                            <div className="mb-8">
                                <div className="inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 ring-1 ring-emerald-600/10">
                                    <span className="mr-2 h-2 w-2 rounded-full bg-emerald-400"></span>
                                    Introducing PanAI
                                </div>
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-5xl xl:text-6xl">
                                24/7 pharmacy calls,{" "}
                                <span className="text-emerald-600">
                                    simplified
                                </span>
                            </h1>

                            <p className="mt-6 text-lg leading-8 text-slate-600">
                                PanAI answers patient calls, processes OTC and
                                prescription requests, and ensures nothing falls
                                through the cracks — day or night. Built for
                                modern pharmacies.
                            </p>

                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    href="/sales"
                                    className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all duration-200"
                                >
                                    Start Free Trial
                                </Link>
                                <Link
                                    href="#demo"
                                    className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all duration-200"
                                >
                                    Watch Demo
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="mt-12 grid grid-cols-3 gap-8 sm:gap-12">
                                <div className="text-center lg:text-left">
                                    <div className="text-3xl font-bold text-slate-900">
                                        24/7
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        Call Coverage
                                    </div>
                                </div>
                                <div className="text-center lg:text-left">
                                    <div className="text-3xl font-bold text-slate-900">
                                        100%
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        HIPAA Compliant
                                    </div>
                                </div>
                                <div className="text-center lg:text-left">
                                    <div className="text-3xl font-bold text-slate-900">
                                        5min
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        Average Setup
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Visual */}
                        <div className="relative lg:ml-10">
                            <div className="relative rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-slate-900/5">
                                <div className="absolute -top-4 -left-4 h-72 w-72 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-20 blur-3xl"></div>
                                <div className="relative">
                                    <div className="mb-6 flex items-center justify-between">
                                        <div className="h-3 w-32 rounded-full bg-slate-200"></div>
                                        <div className="h-3 w-16 rounded-full bg-emerald-200"></div>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            "Answer patient calls automatically",
                                            "Process OTC orders instantly",
                                            "Handle prescription refills",
                                            "Route to staff when needed",
                                        ].map((text, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:bg-slate-100"
                                            >
                                                <div className="mr-3 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                                    <div className="h-2 w-2 rounded-full bg-emerald-600"></div>
                                                </div>
                                                <div className="text-sm font-medium text-slate-700">
                                                    {text}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 sm:py-32 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-base font-semibold leading-7 text-emerald-600">
                            Everything you need
                        </h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Built for pharmacy operations
                        </p>
                        <p className="mt-6 text-lg leading-8 text-slate-600">
                            A comprehensive AI assistant designed to streamline
                            your pharmacy workflow and improve patient
                            experience.
                        </p>
                    </div>

                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            {[
                                {
                                    name: "24/7 Call Handling",
                                    description:
                                        "Never miss a patient call with round-the-clock AI support that understands pharmacy operations.",
                                    icon: "📞",
                                },
                                {
                                    name: "OTC Order Processing",
                                    description:
                                        "Automatically take and process over-the-counter medication orders with inventory integration.",
                                    icon: "💊",
                                },
                                {
                                    name: "Prescription Management",
                                    description:
                                        "Handle refill requests, verify patient information, and route approvals to licensed staff.",
                                    icon: "📋",
                                },
                                {
                                    name: "System Integration",
                                    description:
                                        "Seamlessly connects with your existing pharmacy management software and workflows.",
                                    icon: "🔗",
                                },
                                {
                                    name: "Compliance & Security",
                                    description:
                                        "HIPAA-compliant with enterprise-grade security. BAA available for healthcare partnerships.",
                                    icon: "🔒",
                                },
                                {
                                    name: "Analytics Dashboard",
                                    description:
                                        "Track call volume, response times, and operational metrics with detailed reporting.",
                                    icon: "📊",
                                },
                            ].map((feature) => (
                                <div
                                    key={feature.name}
                                    className="flex flex-col"
                                >
                                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 text-xl">
                                        {feature.icon}
                                    </div>
                                    <dt className="text-base font-semibold leading-7 text-slate-900">
                                        {feature.name}
                                    </dt>
                                    <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                        <p className="flex-auto">
                                            {feature.description}
                                        </p>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </section>

            {/* Compliance Section */}
            <section id="compliance" className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Enterprise-grade compliance
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-slate-600">
                            Built with pharmacy regulations in mind. PanAI meets
                            all industry standards for healthcare technology.
                        </p>
                    </div>

                    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                        <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
                            <h3 className="text-xl font-semibold text-slate-900">
                                HIPAA Compliance
                            </h3>
                            <p className="mt-4 text-slate-600">
                                Full HIPAA compliance with encrypted data
                                transmission, secure storage, and comprehensive
                                audit trails.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-2">
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                                    Encrypted
                                </span>
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                                    Audit Logs
                                </span>
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                                    BAA Ready
                                </span>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
                            <h3 className="text-xl font-semibold text-slate-900">
                                Pharmacy Standards
                            </h3>
                            <p className="mt-4 text-slate-600">
                                Designed to meet state and federal pharmacy
                                regulations with built-in safeguards and
                                compliance checks.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-2">
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                                    FDA Compliant
                                </span>
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                                    State Licensed
                                </span>
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                                    SOC 2 Type II
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="pricing" className="bg-emerald-600 py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Ready to transform your pharmacy?
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-emerald-100">
                            Join the growing number of pharmacies using PanAI to
                            improve patient care and streamline operations.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                href="/sales"
                                className="rounded-lg bg-white px-8 py-3 text-base font-semibold text-emerald-600 shadow-sm hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200"
                            >
                                Get Started Today
                            </Link>
                            <Link
                                href="/sales"
                                className="text-base font-semibold leading-6 text-white hover:text-emerald-100 transition-colors duration-200"
                            >
                                Schedule Demo <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                        <p className="mt-6 text-sm text-emerald-200">
                            Free 30-day trial • No setup fees • Cancel anytime
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {/*<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700">
                                <span className="text-xs font-bold text-white">
                                    P
                                </span>
                            </div>*/}
                            {/*<div>
                                <div className="text-sm font-semibold text-slate-900">
                                    Panacea
                                </div>
                                <div className="text-xs text-slate-500">
                                    © {new Date().getFullYear()} PanAI, Inc.
                                </div>
                            </div>*/}
                        </div>

                        <div className="flex space-x-6">
                            <Link
                                href="/#features"
                                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                Features
                            </Link>
                            <Link
                                href="/#compliance"
                                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                Compliance
                            </Link>
                            <Link
                                href="/#pricing"
                                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                Pricing
                            </Link>
                            <Link
                                href="/sales"
                                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
