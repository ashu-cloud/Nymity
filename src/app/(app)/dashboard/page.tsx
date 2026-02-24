'use client';

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Copy, RefreshCcw, Loader2, Sparkles, Settings2, ChevronDown } from "lucide-react";
import { User } from "next-auth";
import { toast } from "sonner";
import Pusher from 'pusher-js';
import { Message } from "@/model/user";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import MessageCard from "@/components/messageCard";
import useSWR from 'swr';

// --- FIX 1: Define SWR Fetcher ---
// This tells SWR how to grab data across the app
const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function Dashboard() {
    // --- FIX 2: Pagination State ---
    // Instead of rendering 500 messages, we start with 12 and chunk them
    const [visibleCount, setVisibleCount] = useState<number>(12);
    
    const { data: session, status } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues: { acceptMessages: false }
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

    // --- FIX 1: SWR Implementation for Messages & Settings ---
    // This replaces all your complex useEffect and useState data fetching!
    // It automatically handles caching, loading states, and background refetching.
    const { 
        data: messagesResponse, 
        isLoading: isMessagesLoading, 
        mutate: mutateMessages 
    } = useSWR<ApiResponse>(session?.user ? '/api/get-messages' : null, fetcher);

    const { 
        data: settingsResponse, 
        mutate: mutateSettings 
    } = useSWR<ApiResponse>(session?.user ? '/api/accept-messages' : null, fetcher);

    // Safely extract messages from the SWR cache, default to empty array
    const messages = messagesResponse?.messages || [];

    // Sync SWR settings cache with React Hook Form
    useEffect(() => {
        if (settingsResponse) {
            setValue('acceptMessages', settingsResponse.isAcceptingMessages ?? true);
        }
    }, [settingsResponse, setValue]);

    // Handle Delete: Update SWR Cache Optimistically
    const handleDeleteMessage = (messageId: string) => {
        mutateMessages((currentData) => {
            if (!currentData) return currentData;
            return {
                ...currentData,
                messages: (currentData.messages || []).filter((m) => String(m._id) !== messageId)
            };
        }, false); // false means don't trigger a background re-fetch immediately
    };

    // Handle Switch: Update settings with rollback on error
    const handleSwitchChange = async () => {
        const previousSetting = acceptMessages;
        const newSetting = !acceptMessages;

        // Optimistic UI Update: Flip the switch instantly for a snappy UX
        setValue('acceptMessages', newSetting);

        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: newSetting
            });
            // Update the SWR cache silently
            mutateSettings({ ...settingsResponse, isAcceptingMessages: newSetting } as ApiResponse, false);
            toast.success(response.data.message);
        } catch (e) {
            // Revert UI if the server fails
            setValue('acceptMessages', previousSetting);
            const axiosError = e as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? "Failed to update settings");
        }
    };

    // --- REAL-TIME PUSHER INTEGRATION ---
    useEffect(() => {
        if (!session || !session.user) return;

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });

        const channel = pusher.subscribe(session.user._id as string);

        channel.bind('new-message', (newMessage: Message) => {
            // Update the SWR Cache instantly when a websocket event fires!
            mutateMessages((currentData) => {
                const existingMessages = currentData?.messages || [];
                return {
                    ...currentData,
                    messages: [newMessage, ...existingMessages]
                } as ApiResponse;
            }, false);

            toast.success('New anonymous message received! 🤫', {
                description: "Someone just dropped a truth bomb."
            });
        });

        return () => {
            pusher.unsubscribe(session.user._id as string);
            pusher.disconnect(); 
        };
    }, [session, mutateMessages]); // added mutateMessages to dependency array

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
        );
    }

    if (!session || !session.user) {
        return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white font-bold text-xl">Please Log-in</div>;
    }

    const { username } = session.user as User;
    const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboardUrl = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success("Copied to clipboard!");
    };

    return (
        <div className="relative min-h-screen bg-[#0a0a0f] selection:bg-violet-500/30 pt-28 pb-12 px-4 sm:px-6 lg:px-8">

            {/* Ambient Mesh Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px]" />
                <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[50%] rounded-full bg-cyan-600/10 blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto space-y-8">

                {/* Header Section */}
                <div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 pb-2">
                        User Dashboard
                    </h1>
                    <p className="text-[#94a3b8] font-medium text-lg mt-1">
                        Manage your secret links and incoming messages.
                    </p>
                </div>

                {/* Control Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Unique Link Card */}
                    <div className="rounded-[2rem] bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] p-6 sm:p-8 shadow-[0_0_40px_rgba(124,58,237,0.05)]">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="w-5 h-5 text-cyan-400" />
                            <h2 className="text-xl font-bold text-white">Your Unique Link</h2>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <input
                                type="text"
                                value={profileUrl}
                                disabled
                                className="w-full h-12 bg-[#0d0d1a]/50 border border-white/[0.08] text-white/70 px-4 rounded-xl text-sm outline-none"
                            />
                            <Button
                                onClick={copyToClipboardUrl}
                                className="w-full sm:w-auto h-12 bg-gradient-to-r from-violet-600 to-cyan-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] text-white rounded-xl transition-all duration-300 border-0"
                            >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Link
                            </Button>
                        </div>
                    </div>

                    {/* Settings Card */}
                    <div className="rounded-[2rem] bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] p-6 sm:p-8 shadow-[0_0_40px_rgba(124,58,237,0.05)] flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <Settings2 className="w-5 h-5 text-violet-400" />
                            <h2 className="text-xl font-bold text-white">Message Settings</h2>
                        </div>
                        <div className="flex items-center justify-between bg-[#0d0d1a]/50 border border-white/[0.08] p-4 rounded-xl">
                            <span className="text-white/80 font-medium">Accept Anonymous Messages</span>
                            <Switch
                                {...register('acceptMessages')}
                                checked={acceptMessages}
                                onCheckedChange={handleSwitchChange}
                                className="data-[state=checked]:bg-violet-600"
                            />
                        </div>
                    </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Messages Divider & Refresh */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Your Messages</h2>
                    <Button
                        variant="ghost"
                        onClick={(e) => {
                            e.preventDefault();
                            // SWR mutates data in the background instantly
                            mutateMessages(); 
                            toast.success("Messages Refreshed");
                        }}
                        className="h-10 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 group transition-all"
                    >
                        <RefreshCcw className={`w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500 text-cyan-400 ${isMessagesLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                {/* --- FIX 2: Message Grid with Pagination --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {messages.length > 0 ? (
                        [...messages]
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(0, visibleCount) // Slice array to protect the DOM
                            .map((message) => (
                                <MessageCard
                                    key={String(message._id)}
                                    message={message}
                                    onMessageDelete={handleDeleteMessage}
                                />
                            ))
                    ) : (
                        <div className="col-span-full py-20 text-center rounded-[2rem] border border-dashed border-white/20 bg-white/[0.01]">
                            <p className="text-[#94a3b8] text-lg font-medium">No messages to display.</p>
                            <p className="text-white/40 text-sm mt-2">Share your link to start receiving feedback!</p>
                        </div>
                    )}
                </div>

                {/* Load More Button */}
                {messages.length > visibleCount && (
                    <div className="flex justify-center mt-10">
                        <Button
                            variant="outline"
                            onClick={() => setVisibleCount((prev) => prev + 12)}
                            className="h-12 px-8 bg-transparent hover:bg-white/5 text-white rounded-full border border-white/20 transition-all font-semibold"
                        >
                            <ChevronDown className="w-5 h-5 mr-2 animate-bounce" />
                            Load More Messages
                        </Button>
                    </div>
                )}
                
            </div>
        </div>
    );
}