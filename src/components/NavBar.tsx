'use client';

import React from 'react';
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import { Sparkles, LogOut, LogIn } from 'lucide-react';

// Make sure to use your shadcn UI button, not the react-email one!
import { Button } from "@/components/ui/button";

export default function NavBar() {
    const { data: session } = useSession();
    const user: User = session?.user as User;

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0f]/40 backdrop-blur-xl border-b border-white/[0.04] selection:bg-violet-500/30">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Brand / Logo */}
                <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                    <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors duration-300">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 hidden sm:block">
                        Nymity
                    </span>
                </Link>

                {/* Auth Actions */}
                <div className="flex items-center gap-4">
                    {session ? (
                        <>
                            <span className="hidden md:inline-block text-sm font-medium text-[#94a3b8]">
                                Welcome, <span className="text-white font-bold">{user?.username || user?.email}</span>
                            </span>
                            <Button
                                onClick={() => signOut()}
                                variant="ghost"
                                className="relative h-10 px-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-medium transition-all duration-300 border border-white/10 hover:border-white/20 group/btn"
                            >
                                <span className="flex items-center gap-2">
                                    <LogOut className="w-4 h-4 text-pink-400 group-hover/btn:-translate-x-1 transition-transform duration-300" />
                                    Logout
                                </span>
                            </Button>
                        </>
                    ) : (
                        <Link href="/sign-in">
                            <Button
                                className="relative h-10 px-6 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-full font-bold shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-[1.02] transition-all duration-300 overflow-hidden group/btn border-0"
                            >
                                {/* Button shine effect */}
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite] skew-x-12" />
                                <span className="flex items-center gap-2">
                                    Sign In
                                    <LogIn className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                </span>
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}