"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import { Play, Pause, Volume2, Mic } from "lucide-react"; // Install lucide-react if not present

export default function LandingPage(): React.JSX.Element {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioFileName = "/ElevenLabs_2026-02-07T13_20_56_Viraj - Rich, Confident and Expressive_pvc_sp105_s50_sb75_se0_b_m2.mp3";

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 sm:py-32">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-16 lg:grid-cols-2 lg:gap-12 items-center">
                        
                        {/* Left Column - Rebranded Content */}
                        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
                            <div className="mb-8">
                                <div className="inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 ring-1 ring-emerald-600/10">
                                    <span className="mr-2 h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Next-Gen Voice Synthesis
                                </div>
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-5xl xl:text-6xl">
                                AI voices that sound{" "}
                                <span className="text-emerald-600">
                                    undeniably human
                                </span>
                            </h1>

                            <p className="mt-6 text-lg leading-8 text-slate-600">
                                Deploy expressive, high-fidelity voice agents in minutes. 
                                From customer support to immersive storytelling, PanAI 
                                delivers the world&apos;s most realistic speech synthesis.
                            </p>

                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    href="/signup"
                                    className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-emerald-700 transition-all duration-200 hover:scale-105"
                                >
                                    Get Started Free
                                </Link>
                                <button
                                    onClick={togglePlay}
                                    className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all duration-200"
                                >
                                    {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                                    {isPlaying ? "Pause Demo" : "Listen to Viraj"}
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="mt-12 grid grid-cols-3 gap-8">
                                <div className="text-center lg:text-left">
                                    <div className="text-2xl font-bold text-slate-900">&lt;150ms</div>
                                    <div className="text-sm text-slate-600">Ultra-low Latency</div>
                                </div>
                                <div className="text-center lg:text-left">
                                    <div className="text-2xl font-bold text-slate-900">29+</div>
                                    <div className="text-sm text-slate-600">Languages</div>
                                </div>
                                <div className="text-center lg:text-left">
                                    <div className="text-2xl font-bold text-slate-900">99%</div>
                                    <div className="text-sm text-slate-600">Emotion Accuracy</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - The Interactive Demo Card */}
                        <div className="relative lg:ml-10">
                            <div className="relative rounded-3xl bg-slate-900 p-1 shadow-2xl ring-1 ring-slate-900/5 overflow-hidden">
                                <div className="bg-white rounded-[22px] p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <Mic className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900">Voice Preview</h3>
                                                <p className="text-xs text-slate-500">Model: Viraj (Expressive)</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-1">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className={`h-1 w-1 rounded-full ${isPlaying ? 'bg-emerald-500 animate-bounce' : 'bg-slate-300'}`} style={{ animationDelay: `${i * 0.1}s` }} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Waveform Visualization Placeholder */}
                                    <div className="flex items-end justify-between h-24 gap-1 mb-8">
                                        {[...Array(20)].map((_, i) => (
                                            <div 
                                                key={i} 
                                                className={`w-full bg-emerald-500/20 rounded-full transition-all duration-300 ${isPlaying ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                                style={{ 
                                                    height: isPlaying ? `${Math.random() * 100}%` : '15%',
                                                    transitionDelay: `${i * 0.05}s`
                                                }}
                                            />
                                        ))}
                                    </div>

                                    <audio 
                                        ref={audioRef} 
                                        src={audioFileName} 
                                        onEnded={() => setIsPlaying(false)}
                                    />

                                    <button 
                                        onClick={togglePlay}
                                        className="w-full flex items-center justify-center space-x-3 py-4 rounded-xl bg-slate-900 text-white hover:bg-emerald-600 transition-colors group"
                                    >
                                        {isPlaying ? (
                                            <>
                                                <Pause className="h-5 w-5 fill-current" />
                                                <span className="font-semibold">Pause Sample</span>
                                            </>
                                        ) : (
                                            <>
                                                <Play className="h-5 w-5 fill-current" />
                                                <span className="font-semibold">Play Voice Sample</span>
                                            </>
                                        )}
                                    </button>

                                    <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                                        <div className="flex items-center">
                                            <Volume2 className="h-3 w-3 mr-1" />
                                            44.1kHz / 128kbps
                                        </div>
                                        <span>Powered by ElevenLabs</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Decorative blur */}
                            <div className="absolute -z-10 -bottom-6 -right-6 h-64 w-64 rounded-full bg-emerald-400 opacity-20 blur-3xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rebranded Features Section */}
            <section id="features" className="py-24 sm:py-32 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-base font-semibold leading-7 text-emerald-600">
                            Enterprise Voice Tech
                        </h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            The future of audio is here
                        </p>
                    </div>

                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            {[
                                {
                                    name: "Emotional Inflection",
                                    description: "Our AI understands context and adds appropriate emotion, from excitement to empathy.",
                                    icon: "🎭",
                                },
                                {
                                    name: "Instant Voice Cloning",
                                    description: "Clone any voice with just 60 seconds of audio data for perfectly branded experiences.",
                                    icon: "🧬",
                                },
                                {
                                    name: "Real-time Conversational",
                                    description: "Engineered for speed. Our APIs allow for back-and-forth talk without awkward pauses.",
                                    icon: "⚡",
                                },
                            ].map((feature) => (
                                <div key={feature.name} className="flex flex-col bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-hover hover:shadow-md">
                                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 text-xl shadow-lg shadow-emerald-200">
                                        {feature.icon}
                                    </div>
                                    <dt className="text-base font-semibold leading-7 text-slate-900">
                                        {feature.name}
                                    </dt>
                                    <dd className="mt-1 text-base leading-7 text-slate-600">
                                        {feature.description}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </section>
        </div>
    );
}
