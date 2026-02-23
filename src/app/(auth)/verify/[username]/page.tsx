'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function VerifyAccount() {
    const router = useRouter();
    const params = useParams<{ username: string }>();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: { code: '' }
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code,
            });

            toast(response.data.message);

            router.replace("/sign-in");
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message ?? 'Invalid verification code.';

            toast('Verification Failed')
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[#0a0a0f] overflow-hidden selection:bg-violet-500/30">


            {/* Ambient Mesh Gradient Blobs */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-violet-600/15 blur-[120px]" />
                <div className="absolute top-[40%] -right-[10%] w-[50%] h-[60%] rounded-full bg-cyan-600/10 blur-[120px]" />
            </div>

            {/* Main Glassmorphism Card */}
            <div className="relative z-10 w-full max-w-lg px-4 sm:px-6">
                <div className="group relative rounded-[2rem] bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] p-8 sm:p-10 shadow-[0_0_40px_rgba(124,58,237,0.1)] hover:shadow-[0_0_60px_rgba(124,58,237,0.2)] hover:-translate-y-1 transition-all duration-500 ease-out">

                    {/* Inner subtle glow ring on hover */}
                    <div className="absolute inset-0 rounded-[2rem] border border-white/0 group-hover:border-violet-500/20 transition-colors duration-500 pointer-events-none" />

                    <div className="flex flex-col items-center space-y-4 text-center mb-8">
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-cyan-600/20 border border-white/[0.05] shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                            <ShieldCheck className="w-8 h-8 text-cyan-400" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 pb-1">
                                Secure Identity
                            </h1>
                            <p className="text-[#94a3b8] font-medium text-sm sm:text-base">
                                Enter the authorization code sent to your device.
                            </p>
                        </div>
                    </div>

                    {/* Gradient Divider */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.1] to-transparent mb-8" />

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="code"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/70 ml-1">Access Code</FormLabel>
                                        <div className="relative group/input">
                                            <Input
                                                className="h-14 bg-[#0d0d1a]/50 border-white/[0.08] text-white focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:border-violet-500/50 placeholder:text-white/20 text-center text-xl tracking-[0.5em] rounded-xl transition-all duration-300"
                                                placeholder="••••••"
                                                maxLength={6}
                                                {...field}
                                            />
                                            {/* Subtle input glow on hover */}
                                            <div className="absolute inset-0 -z-10 bg-violet-500/0 group-hover/input:bg-violet-500/5 blur-xl rounded-xl transition-all duration-300" />
                                        </div>
                                        <FormMessage className="text-pink-500 text-center mt-2" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="relative w-full h-14 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-full font-bold text-lg shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:scale-[1.02] transition-all duration-300 overflow-hidden group/btn border-0"
                                disabled={isSubmitting}
                            >
                                {/* Button shine effect */}
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite] skew-x-12" />

                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Authenticating...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Verify Account
                                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}