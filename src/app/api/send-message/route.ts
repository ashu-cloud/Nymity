import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/user";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { username, content } = await req.json();

        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        if (!user.isAcceptingMessage) {
            return Response.json({ success: false, message: "User is not accepting messages" }, { status: 403 });
        }

        const newMessage = {
            content,
            createdAt: new Date(),
        };

        user.messages.push(newMessage as Message);
        await user.save();

        // --- REAL-TIME PUSHER TRIGGER ---
        // Grab the exact message we just saved so we get the MongoDB generated _id
        const savedMessage = user.messages[user.messages.length - 1];

        try {
            // Trigger an event on a channel uniquely named after the user
            await pusherServer.trigger(
                `user-${user.username}`,
                'new-message',
                savedMessage
            );
        } catch (pusherError) {
            console.error("Pusher trigger failed:", pusherError);
            // We don't return an error here because the message STILL saved to the database successfully!
        }

        return Response.json({ success: true, message: "Message sent successfully" }, { status: 200 });
    } catch (err) {
        console.log(err);
        return Response.json({ success: false, message: "Unable to send message" }, { status: 500 });
    }
}