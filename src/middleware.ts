import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// 1. Initialize Redis and the Rate Limiter
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Create a sliding window rate limiter: 5 requests per 1 minute
const rateLimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
});

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // --- EDGE RATE LIMITING FOR PUBLIC API ---
    // We strictly limit the send-message route to prevent spam
    if (pathname.startsWith('/api/send-message')) {
        // Get the user's IP address from the request headers
        const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';

        // Check the limit for this specific IP
        const { success } = await rateLimit.limit(`ratelimit_${ip}`);

        // If they exceed 5 messages in a minute, block them at the Edge!
        if (!success) {
            return NextResponse.json(
                { success: false, message: "Whoa, slow down! Too many messages sent. Please try again in a minute." },
                { status: 429 } // 429 is the official status code for "Too Many Requests"
            );
        }
    }

    // --- EXISTING NEXTAUTH SECURITY LOGIC ---
    const token = await getToken({
        req: request,
        secret: process.env.NEXT_AUTH_SECRET
    });

    // If user is logged in and tries to access auth pages
    if (
        token &&
        (pathname.startsWith("/sign-in") ||
            pathname.startsWith("/sign-up") ||
            pathname.startsWith("/verify"))
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If user is NOT logged in and tries to access protected pages
    if (!token && pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

// Ensure the middleware runs on your API routes too!
export const config = {
    matcher: [
        "/sign-in",
        "/sign-up",
        "/verify/:path*",
        "/dashboard/:path*",
        "/api/send-message", // <--- CRITICAL: Added the API route to the matcher
    ],
};