import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/user";
import { pusherServer } from "@/lib/pusher";
import mongoose from "mongoose";

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
            _id: new mongoose.Types.ObjectId(),
            content: content,
            createdAt: new Date(),
            recipientId: user._id,
        };
        await UserModel.updateOne(
            { _id: user._id },
            { $push: { messages: newMessage } }
        );
        // --- REAL-TIME PUSHER TRIGGER ---
        // Grab the exact message we just saved so we get the MongoDB generated _id
        const pusherMessage = {
            _id: newMessage._id.toString(), // <-- CRITICAL: Convert Object to String
            content: newMessage.content,
            createdAt: newMessage.createdAt,
            // recipientId: newMessage.recipientId.toString() // (Optional if needed on frontend)
        };

        const savedMessage = user.messages[user.messages.length - 1];

        try {
            // Trigger an event on a channel uniquely named after the user
            await pusherServer.trigger(user._id.toString(), 'new-message', pusherMessage);
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