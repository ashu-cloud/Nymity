import { NextAuthOptions } from "next-auth"; // <-- This missing import fixes 90% of the errors!
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                identifier: {
                    label: "Email or Username",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize(credentials: any): Promise<any> {
                await dbConnect();

                if (!credentials || !credentials.identifier || !credentials.password) {
                    throw new Error("Missing credentials");
                }

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ],
                    });

                    if (!user) {
                        throw new Error("User not found");
                    }

                    if (!user.isVerified) {
                        throw new Error("Verify your account first");
                    }

                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordCorrect) {
                        throw new Error("Invalid credentials");
                    }

                    return user as any;
                } catch (error: any) {
                    throw new Error(error.message || "Login failed");
                }
            },
        }),
    ],

    callbacks: {
        async signIn({ user, account }) {
            // If it's a social login (Google/Github)
            if (account?.provider !== "credentials") {
                await dbConnect();
                try {
                    const existingUser = await UserModel.findOne({ email: user.email as string });

                    if (!existingUser) {
                        // Create a new user if it's their first time
                        const baseUsername = user.email?.split('@')[0] || "user";
                        const uniqueUsername = `${baseUsername}_${Math.floor(Math.random() * 1000)}`;

                        await UserModel.create({
                            email: user.email as string,
                            username: uniqueUsername,
                            isVerified: true,
                            isAcceptingMessage: true,
                            messages: [],
                        });
                    }
                    return true;
                } catch (error) {
                    console.error("Error creating OAuth user:", error);
                    return false;
                }
            }
            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }

            // Fetch from DB for OAuth users who just logged in
            if (!token.username) {
                await dbConnect();
                const dbUser = await UserModel.findOne({ email: token.email as string });
                if (dbUser) {
                    token._id = dbUser._id.toString();
                    token.isVerified = dbUser.isVerified;
                    token.isAcceptingMessages = dbUser.isAcceptingMessage;
                    token.username = dbUser.username;
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user._id = token._id as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
                session.user.username = token.username as string;
            }
            return session;
        },
    },

    pages: {
        signIn: "/sign-in",
    },

    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXT_AUTH_SECRET,
};