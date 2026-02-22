'use client'

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
import { toast } from "sonner"
import { signInSchema } from '@/schemas/signInSchema';

function Page() {
    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Logged in successfully");
            router.replace("/dashboard");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-zinc-100">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
                        Welcome Back to True Feedback
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Sign in to continue your secret conversations
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-700">Email/Username</FormLabel>
                                    <Input
                                        className="focus-visible:ring-zinc-900"
                                        {...field}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-700">Password</FormLabel>
                                    <Input
                                        type="password"
                                        className="focus-visible:ring-zinc-900"
                                        {...field}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full bg-zinc-950 hover:bg-zinc-800 text-white transition-colors py-5 mt-2" type="submit">
                            Sign In
                        </Button>
                    </form>
                </Form>

                <div className="mt-6 text-center text-sm text-zinc-500">
                    <p>
                        Not a member yet?{' '}
                        <Link
                            href="/sign-up"
                            className="font-semibold text-zinc-900 hover:text-zinc-700 underline underline-offset-4 transition-colors"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Page