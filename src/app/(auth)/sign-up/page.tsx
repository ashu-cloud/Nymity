'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {toast } from "sonner"
import axios, { AxiosError } from 'axios';
import { Loader2, UserPlus, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';

export default function SignUpForm() {
    const [username, setUsername] = useState('');
    const [debouncedUsername, setDebouncedUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { username: '', email: '', password: '' },
    });

    useEffect(() => {
        const timer = setTimeout(() => { setDebouncedUsername(username); }, 500);
        return () => clearTimeout(timer);
    }, [username]);

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (debouncedUsername) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${debouncedUsername}`);
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username');
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUnique();
    }, [debouncedUsername]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data);
            toast(response.data.message);
            router.replace(`/verify/${username}`);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast('Sign Up Failed'
               );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[#0a0a0f] overflow-hidden selection:bg-violet-500/30">


            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-violet-600/15 blur-[120px]" />
                <div className="absolute bottom-[20%] -left-[10%] w-[50%] h-[60%] rounded-full bg-cyan-600/10 blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-md px-4 sm:px-6 pt-24 pb-12">
                <div className="group relative rounded-[2rem] bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] p-8 sm:p-10 shadow-[0_0_40px_rgba(124,58,237,0.1)] hover:shadow-[0_0_60px_rgba(124,58,237,0.2)] hover:-translate-y-1 transition-all duration-500 ease-out">

                    <div className="absolute inset-0 rounded-[2rem] border border-white/0 group-hover:border-violet-500/20 transition-colors duration-500 pointer-events-none" />

                    <div className="flex flex-col items-center space-y-4 text-center mb-8">
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-cyan-600/20 border border-white/[0.05] shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                            <UserPlus className="w-8 h-8 text-cyan-400" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 pb-1">
                                Join Us
                            </h1>
                            <p className="text-[#94a3b8] font-medium text-sm sm:text-base">
                                Start your anonymous adventure
                            </p>
                        </div>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.1] to-transparent mb-8" />

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                name="username"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/70 ml-1">Username</FormLabel>
                                        <div className="relative group/input">
                                            <Input
                                                className="h-12 bg-[#0d0d1a]/50 border-white/[0.08] text-white focus-visible:ring-2 focus-visible:ring-violet-500/50 placeholder:text-white/20 rounded-xl transition-all duration-300 px-4"
                                                placeholder="Choose a username"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setUsername(e.target.value);
                                                }}
                                            />
                                            {isCheckingUsername && (
                                                <Loader2 className="absolute right-3 top-3.5 h-5 w-5 animate-spin text-cyan-400" />
                                            )}
                                            <div className="absolute inset-0 -z-10 bg-violet-500/0 group-hover/input:bg-violet-500/5 blur-xl rounded-xl transition-all duration-300" />
                                        </div>
                                        {!isCheckingUsername && usernameMessage && (
                                            <p className={`text-sm mt-1 ml-1 font-medium ${usernameMessage === 'Username is unique' ? 'text-cyan-400' : 'text-pink-400'}`}>
                                                {usernameMessage}
                                            </p>
                                        )}
                                        <FormMessage className="text-pink-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/70 ml-1">Email</FormLabel>
                                        <div className="relative group/input">
                                            <Input
                                                className="h-12 bg-[#0d0d1a]/50 border-white/[0.08] text-white focus-visible:ring-2 focus-visible:ring-violet-500/50 placeholder:text-white/20 rounded-xl transition-all duration-300 px-4"
                                                placeholder="Enter your email"
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
                                className="relative w-full h-12 mt-6 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-full font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:scale-[1.02] transition-all duration-300 overflow-hidden group/btn border-0"
                                disabled={isSubmitting}
                            >
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite] skew-x-12" />

                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Creating account...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign Up
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-8 text-center text-sm text-[#94a3b8]">
                        <p>
                            Already a member?{' '}
                            <Link
                                href="/sign-in"
                                className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 hover:opacity-80 transition-opacity"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}