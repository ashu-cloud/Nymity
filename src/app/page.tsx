import Link from "next/link";
import {
    ArrowRight, MessageSquare, ShieldCheck, Share2, Sparkles,
    Lock, Zap, Globe, Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="relative min-h-screen bg-[#0a0a0f] selection:bg-violet-500/30 overflow-hidden flex flex-col">

            {/* Ambient Mesh Gradients (Fixed to background) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/15 blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-cyan-600/10 blur-[120px]" />
            </div>

            <main className="relative z-10 w-full flex flex-col items-center">

                {/* ================= HERO SECTION ================= */}
                <section className="w-full max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(124,58,237,0.1)] hover:bg-white/[0.05] transition-colors cursor-default">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        <span className="text-sm font-medium text-white/80">The new standard for anonymous feedback</span>
                    </div>

                    <h1 className="max-w-4xl text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50 mb-6 pb-2 leading-tight">
                        Dive into the World of <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                            Anonymous Truths
                        </span>
                    </h1>

                    <p className="max-w-2xl text-lg md:text-xl leading-relaxed text-[#94a3b8] mb-10">
                        Nymity is your secure digital vault for honest, unfiltered thoughts. Create your unique link, share it with your audience, and let the secrets flow in.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link href="/sign-up" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-full font-bold text-lg shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_45px_rgba(6,182,212,0.5)] hover:scale-[1.02] transition-all duration-300 border-0 group">
                                Start Your Adventure
                                {/*<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />*/}
                            </Button>
                        </Link>
                        <Link href="/sign-in" className="w-full sm:w-auto">
                            <Button variant="ghost" className="w-full sm:w-auto h-14 px-8 bg-white/[0.03] hover:bg-white/[0.08] text-white rounded-full font-bold text-lg border border-white/[0.08] backdrop-blur-md transition-all duration-300">
                                Member Login
                            </Button>
                        </Link>
                    </div>
                </section>


                {/* ================= HOW IT WORKS ================= */}
                <section className="w-full max-w-7xl mx-auto px-6 py-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">How it works</h2>
                        <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">Start receiving honest feedback effortlessly, powered by smart tools.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Step 1 */}
                        <div className="group rounded-[2rem] bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] p-8 hover:-translate-y-2 transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_40px_rgba(124,58,237,0.1)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-[50px] group-hover:bg-violet-500/20 transition-colors" />
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Share2 className="w-7 h-7 text-violet-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">1. Share Your Link</h3>
                            <p className="text-[#94a3b8] text-sm leading-relaxed relative z-10">
                                Generate a unique, secure profile link in seconds. Paste it on your Instagram bio, Twitter, or anywhere else.
                            </p>
                        </div>

                        {/* Step 2 (AI Focus) */}
                        <div className="group rounded-[2rem] bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] p-8 hover:-translate-y-2 transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.1)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[50px] group-hover:bg-cyan-500/20 transition-colors" />
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Bot className="w-7 h-7 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">2. AI Suggestions</h3>
                            <p className="text-[#94a3b8] text-sm leading-relaxed relative z-10">
                                Writers block? Our integrated AI helps your visitors instantly generate thoughtful, engaging messages to send to you.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="group rounded-[2rem] bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] p-8 hover:-translate-y-2 transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px] group-hover:bg-purple-500/20 transition-colors" />
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-6 group-hover:scale-110 transition-transform duration-500">
                                <MessageSquare className="w-7 h-7 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">3. Collect Truths</h3>
                            <p className="text-[#94a3b8] text-sm leading-relaxed relative z-10">
                                Friends and followers drop their unfiltered thoughts, compliments, or confessions anonymously into your secure inbox.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="group rounded-[2rem] bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] p-8 hover:-translate-y-2 transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_40px_rgba(236,72,153,0.1)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-[50px] group-hover:bg-pink-500/20 transition-colors" />
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500/10 border border-pink-500/20 mb-6 group-hover:scale-110 transition-transform duration-500">
                                <ShieldCheck className="w-7 h-7 text-pink-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">4. Stay Protected</h3>
                            <p className="text-[#94a3b8] text-sm leading-relaxed relative z-10">
                                With toggleable accept states and robust security, you remain entirely in control of your digital space.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ================= FEATURES DEEP DIVE ================= */}
                <section className="w-full bg-[#0d0d1a]/50 border-y border-white/[0.04] py-32 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="w-full md:w-1/2 space-y-6">
                                <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                                    Designed for <br/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Absolute Privacy</span>
                                </h2>
                                <p className="text-[#94a3b8] text-lg leading-relaxed">
                                    We built Nymity from the ground up with security in mind. No tracking, no data selling, just pure, unfiltered communication enhanced by smart AI tools.
                                </p>
                                <ul className="space-y-4 pt-4">
                                    <li className="flex items-center gap-3 text-white">
                                        <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-400"><Bot className="w-4 h-4" /></div>
                                        AI-Powered Message Generation & Suggestions
                                    </li>
                                    <li className="flex items-center gap-3 text-white">
                                        <div className="p-1 rounded-full bg-violet-500/20 text-violet-400"><Lock className="w-4 h-4" /></div>
                                        End-to-End Encryption Architecture
                                    </li>
                                    <li className="flex items-center gap-3 text-white">
                                        <div className="p-1 rounded-full bg-pink-500/20 text-pink-400"><Globe className="w-4 h-4" /></div>
                                        Accessible from Any Device
                                    </li>
                                </ul>
                            </div>

                            <div className="w-full md:w-1/2 relative">
                                {/* Decorative mock UI */}
                                <div className="w-full aspect-square md:aspect-video rounded-3xl bg-gradient-to-tr from-violet-600/20 to-cyan-600/20 border border-white/[0.08] backdrop-blur-xl p-6 shadow-[0_0_60px_rgba(124,58,237,0.15)] flex flex-col gap-4 overflow-hidden relative">
                                    <div className="w-full h-12 bg-[#0a0a0f]/80 rounded-xl border border-white/[0.05] flex items-center px-4 gap-3 animate-pulse">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                            <Sparkles className="w-4 h-4 text-violet-400" />
                                        </div>
                                        <div className="w-32 h-3 rounded-full bg-white/10" />
                                    </div>
                                    <div className="w-3/4 h-24 bg-[#0a0a0f]/80 rounded-xl border border-white/[0.05] p-4 flex flex-col gap-2">
                                        <div className="w-full h-3 rounded-full bg-white/5" />
                                        <div className="w-4/5 h-3 rounded-full bg-white/5" />
                                        <div className="w-1/2 h-3 rounded-full bg-white/5" />
                                    </div>
                                    <div className="w-full h-24 bg-[#0a0a0f]/80 rounded-xl border border-white/[0.05] p-4 flex flex-col gap-2 self-end mt-4">
                                        <div className="w-full h-3 rounded-full bg-white/5" />
                                        <div className="w-5/6 h-3 rounded-full bg-white/5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* ================= FAQ ================= */}
                <section className="w-full max-w-4xl mx-auto px-6 py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            { q: "Is it really 100% anonymous?", a: "Yes. We do not track IP addresses, browser fingerprints, or set tracking cookies for users who are submitting messages to your link." },
                            { q: "How does the AI suggestion work?", a: "When someone visits your link, they can click a button to have our AI generate a creative, fun, or thoughtful message template to help them get started." },
                            { q: "Can I turn off my link?", a: "Absolutely. You can toggle your 'Accept Messages' status off at any time from your dashboard, which will instantly disable your public link." },
                            { q: "Is this service free?", a: "Yes! Creating an account and receiving messages is completely free. We believe secure communication should be accessible to everyone." },
                        ].map((faq, i) => (
                            <div key={i} className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-6">
                                <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                                <p className="text-[#94a3b8]">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ================= BOTTOM CTA ================= */}
                <section className="w-full max-w-5xl mx-auto px-6 py-24">
                    <div className="relative rounded-[3rem] overflow-hidden p-10 md:p-20 text-center border border-white/[0.08] shadow-[0_0_80px_rgba(124,58,237,0.15)] bg-[#0d0d1a]/80 backdrop-blur-2xl">
                        {/* CTA Background Gradients */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg bg-gradient-to-b from-violet-600/30 to-cyan-600/10 blur-[80px] -z-10" />

                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Ready to uncover the truth?</h2>
                        <p className="text-[#94a3b8] text-lg md:text-xl max-w-2xl mx-auto mb-10">
                            Join the creators, professionals, and friends who are already using Nymity to collect honest thoughts.
                        </p>
                        <Link href="/sign-up">
                            <Button className="h-16 px-10 bg-white text-black hover:bg-white/90 rounded-full font-black text-lg shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 transition-all duration-300">
                                Create Your Free Account
                            </Button>
                        </Link>
                    </div>
                </section>

            </main>

            {/* ================= FOOTER ================= */}
            <footer className="relative z-10 w-full bg-[#050508] border-t border-white/[0.04] pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-violet-400" />
                                <span className="font-bold text-xl text-white">Nymity</span>
                            </div>
                            <p className="text-[#94a3b8] max-w-xs">
                                The most secure, beautiful, and intuitive way to collect anonymous messages from your audience.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Product</h4>
                            <ul className="space-y-2 text-[#94a3b8]">
                                <li><Link href="/sign-up" className="hover:text-white transition-colors">Sign Up</Link></li>
                                <li><Link href="/sign-in" className="hover:text-white transition-colors">Log In</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Pricing (Free)</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Legal</h4>
                            <ul className="space-y-2 text-[#94a3b8]">
                                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.04]">
                        <p className="text-sm text-white/40 font-medium">
                            © {new Date().getFullYear()} Nymity. All rights reserved.
                        </p>
                        <p className="text-sm text-white/30 mt-2 md:mt-0">
                            Designed with 💜
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}