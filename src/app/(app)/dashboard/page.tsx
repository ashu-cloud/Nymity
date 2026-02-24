'use client';

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Copy, RefreshCcw, Loader2, Sparkles, Settings2 } from "lucide-react";
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

export default function Dashboard() {
    // 1. Fixed state naming (message -> messages)
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

    const { data: session, status } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues: { acceptMessages: false }
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((m) => String(m._id) !== messageId));
    };

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages');
            setValue('acceptMessages', response.data.isAcceptingMessages ?? true);
        } catch (e) {
            const axiosError = e as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? "Failed to fetch settings");
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue]);

    // 2. Fixed the broken nested async function
    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages');
            setMessages(response.data.messages || []);

            if (refresh) {
                toast.success("Showing latest Messages");
            }
        } catch (e) {
            const axiosError = e as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? "Failed to fetch messages");
        } finally {
            setIsLoading(false);
        }
    }, [setMessages]);

    useEffect(() => {
        if (!session || !session.user) return;
        void fetchMessages();
        void fetchAcceptMessage();
    }, [session, setValue, fetchAcceptMessage, fetchMessages]);

    useEffect(() => {
        if (!session || !session.user) return;

        // Initialize the Pusher client
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });

        // Subscribe to this specific user's channel
        const channel = pusher.subscribe(session.user._id as string);

        // Listen for the 'new-message' event we setup in the backend
        channel.bind('new-message', (newMessage: Message) => {
            // Unshift the new message to the top of the state array instantly
            setMessages((prevMessages) => [newMessage, ...prevMessages]);

            // Show a beautiful toast notification
            toast.success('New anonymous message received! 🤫', {
                description: "Someone just dropped a truth bomb."
            });
        });

        // Cleanup function: disconnect when the user leaves the dashboard
        return () => {
            pusher.unsubscribe(session.user._id as string);
            pusher.disconnect(); // Frees up browser memory when they leave the page
        };
    }, [session]);

    // 3. Fixed async typo and changed to axios.post
    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages
            });
            setValue('acceptMessages', !acceptMessages);
            toast.success(response.data.message);
        } catch (e) {
            const axiosError = e as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? "Failed to update settings");
        }
    };

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
    // Safely generate the URL for the client side
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
                                disabled={isSwitchLoading}
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
                            fetchMessages(true);
                        }}
                        className="h-10 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 group transition-all"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                        ) : (
                            <RefreshCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500 text-cyan-400" />
                        )}
                        Refresh
                    </Button>
                </div>

                {/* Message Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {messages.length > 0 ? (
                        // 1. We use [...messages] to safely copy the array so we don't mutate React state directly
                        // 2. We sort it by the createdAt date (newest first)
                        [...messages]
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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
            </div>
        </div>
    );
}