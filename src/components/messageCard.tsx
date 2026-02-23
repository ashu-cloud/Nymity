'use client';

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { X, MessageSquare, Loader2 } from "lucide-react";

import { Message } from "@/model/user";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}

export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            // Added leading slash to ensure it hits the root API
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);

            toast.success(response.data.message || "Message deleted successfully!");
            onMessageDelete((message as any)._id);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? "Failed to delete message");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Card className="group relative overflow-hidden rounded-[2rem] bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] shadow-[0_0_20px_rgba(124,58,237,0.05)] hover:shadow-[0_0_40px_rgba(124,58,237,0.1)] hover:-translate-y-2 transition-all duration-500 ease-out">

            {/* Subtle gradient border effect on hover */}
            <div className="absolute inset-0 rounded-[2rem] border border-white/0 group-hover:border-violet-500/20 transition-colors duration-500 pointer-events-none" />

            <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-cyan-600/20 border border-white/[0.05] shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                        <MessageSquare className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex flex-col">
                        <CardTitle className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
                            Anonymous Message
                        </CardTitle>
                        {/* Assuming your message model has a createdAt date */}
                        <p className="text-xs font-medium text-[#94a3b8] mt-1">
                            {new Date(message.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 hover:text-pink-300 transition-colors border border-pink-500/20"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </AlertDialogTrigger>

                    {/* Styled the Alert Dialog to match the dark glassmorphism */}
                    <AlertDialogContent className="bg-[#0a0a0f] border border-white/[0.08] rounded-[2rem] shadow-[0_0_60px_rgba(236,72,153,0.15)] max-w-md">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold text-white">
                                Delete this message?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-[#94a3b8] text-base">
                                This action cannot be undone. This will permanently delete this anonymous message from your dashboard.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6 gap-3 sm:gap-0">
                            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white rounded-xl transition-colors h-11">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteConfirm}
                                disabled={isDeleting}
                                className="bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] border-0 h-11 min-w-[120px]"
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Delete Message"
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardHeader>

            <CardContent>
                <div className="relative rounded-2xl bg-[#0d0d1a]/50 border border-white/[0.04] p-5">
                    <p className="text-[#e2e8f0] text-base leading-relaxed whitespace-pre-wrap font-medium">
                        {message.content}
                    </p>

                    {/* Decorative quote mark */}
                    <span className="absolute top-2 right-4 text-6xl font-serif text-white/[0.03] select-none pointer-events-none">
                        "
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}