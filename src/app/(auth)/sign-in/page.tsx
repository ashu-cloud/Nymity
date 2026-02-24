'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { signInSchema } from '@/schemas/signInSchema';
import { Loader2, LogIn, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function SignInForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await signIn('credentials', {
                redirect: false,
                identifier: data.identifier,
                password: data.password,
            });

            if (result?.error) {
                toast.error(result.error || 'Login Failed');
                setIsSubmitting(false); // Stop the spinner so they can try again
            } else if (result?.ok) {
                toast.success('Logged in successfully!');
                router.replace('/dashboard');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[#0a0a0f] overflow-hidden selection:bg-violet-500/30">

            {/* Ambient Mesh Gradient Blobs */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-violet-600/15 blur-[120px]" />
                <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[60%] rounded-full bg-cyan-600/10 blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-md px-4 sm:px-6 pt-20">
                <div className="group relative rounded-[2rem] bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] p-8 sm:p-10 shadow-[0_0_40px_rgba(124,58,237,0.1)] hover:shadow-[0_0_60px_rgba(124,58,237,0.2)] hover:-translate-y-1 transition-all duration-500 ease-out">

                    <div className="absolute inset-0 rounded-[2rem] border border-white/0 group-hover:border-violet-500/20 transition-colors duration-500 pointer-events-none" />

                    <div className="flex flex-col items-center space-y-4 text-center mb-8">
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-cyan-600/20 border border-white/[0.05] shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                            <LogIn className="w-8 h-8 text-cyan-400 ml-1" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 pb-1">
                                Welcome Back
                            </h1>
                            <p className="text-[#94a3b8] font-medium text-sm sm:text-base">
                                Sign in to continue your secret conversations
                            </p>
                        </div>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.1] to-transparent mb-8" />

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                name="identifier"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/70 ml-1">Email/Username</FormLabel>
                                        <div className="relative group/input">
                                            <Input
                                                className="h-12 bg-[#0d0d1a]/50 border-white/[0.08] text-white focus-visible:ring-2 focus-visible:ring-violet-500/50 placeholder:text-white/20 rounded-xl transition-all duration-300 px-4"
                                                placeholder="Enter your email or username"
                                                {...field}
                                            />
                                            <div className="absolute inset-0 -z-10 bg-violet-500/0 group-hover/input:bg-violet-500/5 blur-xl rounded-xl transition-all duration-300" />
                                        </div>
                                        <FormMessage className="text-pink-500" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="password"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/70 ml-1">Password</FormLabel>
                                        <div className="relative group/input">
                                            <Input
                                                type="password"
                                                className="h-12 bg-[#0d0d1a]/50 border-white/[0.08] text-white focus-visible:ring-2 focus-visible:ring-violet-500/50 placeholder:text-white/20 rounded-xl transition-all duration-300 px-4"
                                                placeholder="••••••••"
                                                {...field}
                                            />
                                            <div className="absolute inset-0 -z-10 bg-violet-500/0 group-hover/input:bg-violet-500/5 blur-xl rounded-xl transition-all duration-300" />
                                        </div>
                                        <FormMessage className="text-pink-500" />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="relative w-full h-12 mt-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-full font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:scale-[1.02] transition-all duration-300 overflow-hidden group/btn border-0"
                                disabled={isSubmitting}
                            >
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite] skew-x-12" />

                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Authenticating...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign In
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* --- OAUTH SECTION --- */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/[0.08]"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                {/* Matched the background to your glass card! */}
                                <span className="px-2 bg-[#0a0a0f] text-white/50">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                // Styled the buttons to match your custom input fields
                                className="w-full font-semibold bg-[#0d0d1a]/50 border-white/[0.08] text-white hover:bg-white/[0.05] hover:text-white transition-all duration-300"
                                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                            >
                                <FaGoogle className="mr-2 h-4 w-4 text-red-500" />
                                Google
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full font-semibold bg-[#0d0d1a]/50 border-white/[0.08] text-white hover:bg-white/[0.05] hover:text-white transition-all duration-300"
                                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                            >
                                <FaGithub className="mr-2 h-4 w-4" />
                                GitHub
                            </Button>
                        </div>
                    </div>
                    {/* ----------------------- */}

                    <div className="mt-8 text-center text-sm text-[#94a3b8]">
                        <p>
                            Not a member yet?{' '}
                            <Link
                                href="/sign-up"
                                className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 hover:opacity-80 transition-opacity"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}