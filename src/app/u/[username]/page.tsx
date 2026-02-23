'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Loader2, Send, Bot, Sparkles, MessageSquare } from 'lucide-react';
import Link from 'next/link';

import { messageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

export default function PublicProfilePage() {
    const params = useParams<{ username: string }>();
    const username = params.username;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: { content: '' },
    });

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/send-message', {
                username,
                content: data.content,
            });
            toast.success(response.data.message || "Message sent successfully!");
            form.reset();
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? 'Failed to send message. User might not be accepting messages.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchSuggestedMessages = async () => {
        setIsSuggesting(true);
        try {
            const response = await axios.post<{success: boolean, suggestion: string}>('/api/suggest-messages');
            // Split the AI string by '||' as specified in your backend prompt
            const messages = response.data.suggestion.split('||').map(msg => msg.trim()).filter(msg => msg.length > 0);
            setSuggestedMessages(messages);
            toast.success('AI Suggestions generated!');
        } catch (error) {
            toast.error('Failed to generate AI suggestions');
        } finally {
            setIsSuggesting(false);
        }
    };

    const handleSuggestionClick = (message: string) => {
        form.setValue('content', message);
    };

    return (
        <div className="relative min-h-screen bg-[#0a0a0f] selection:bg-violet-500/30 py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-violet-600/15 blur-[120px]" />
                <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[50%] rounded-full bg-cyan-600/10 blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-2xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-600/20 to-cyan-600/20 border border-white/[0.05] shadow-[0_0_30px_rgba(124,58,237,0.2)] mb-4">
                        <MessageSquare className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                        Public Profile
                    </h1>
                    <p className="text-[#94a3b8] text-lg">
                        Send an anonymous message to <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">@{username}</span>
                    </p>
                </div>

                {/* Main Interaction Card */}
                <div className="rounded-[2rem] bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] p-6 sm:p-10 shadow-[0_0_60px_rgba(124,58,237,0.05)]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="content"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/80 text-base">Your Secret Message</FormLabel>
                                        <FormControl>
                                            <textarea
                                                className="w-full min-h-[160px] bg-[#0d0d1a]/60 border border-white/[0.08] text-white focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 placeholder:text-white/20 rounded-2xl transition-all duration-300 p-4 resize-none outline-none"
                                                placeholder={`Type something nice for ${username}...`}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-pink-500" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full h-14 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] transition-all duration-300 border-0"
                                disabled={isSubmitting || !form.watch('content')}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Send Anonymously <Send className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>

                {/* AI Suggestion Panel */}
                <div className="rounded-[2rem] bg-[#0d0d1a]/40 border border-white/[0.04] p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Bot className="w-5 h-5 text-violet-400" /> AI Suggestions
                            </h3>
                            <p className="text-[#94a3b8] text-sm">Out of ideas? Let Gemini AI write a prompt.</p>
                        </div>
                        <Button
                            onClick={fetchSuggestedMessages}
                            disabled={isSuggesting}
                            className="bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1] rounded-xl transition-colors h-10 px-4"
                        >
                            {isSuggesting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />}
                            Generate
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {suggestedMessages.length > 0 ? (
                            suggestedMessages.map((msg, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(msg)}
                                    className="w-full text-left p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-violet-500/30 hover:bg-violet-500/5 text-[#e2e8f0] transition-all duration-300 text-sm"
                                >
                                    "{msg}"
                                </button>
                            ))
                        ) : (
                            <div className="text-center p-6 border border-dashed border-white/10 rounded-xl">
                                <p className="text-white/30 text-sm">Click generate to get AI-powered message ideas.</p>
                            </div>
                        )}
                    </div>
                </div>

                <Separator className="bg-white/10 my-10" />

                <div className="text-center pb-12">
                    <p className="text-white mb-4 font-medium">Want your own secret inbox?</p>
                    <Link href="/sign-up">
                        <Button className="bg-white text-black hover:bg-white/90 rounded-full font-bold px-8 h-12">
                            Create Your Free Account
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}