import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// Backend Server (Used in API routes to trigger events)
export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true,
});

// Frontend Client (Used in React components to listen for events)
export const pusherClient = (key: string, cluster: string) => {
    return new PusherClient(key, {
        cluster: cluster,
    });
};