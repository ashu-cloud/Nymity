import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

export const authOptions: NextAuthOptions = {
    providers: [
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

                // Check to ensure credentials exist and fix "Object is possibly 'undefined'" errors
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

                    // Return user as any to resolve Mongoose Document vs NextAuth User type mismatch
                    return user as any;
                } catch (error: any) {
                    throw new Error(error.message || "Login failed");
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
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