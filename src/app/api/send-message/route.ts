import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/user";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { username, content } = await req.json();

        // Find user in database
        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        // Check if user accepts messages
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting messages",
                },
                { status: 403 }
            );
        }

        const newMessage = {
            content,
            createdAt: new Date(),
        };

        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json(
            {
                success: true,
                message: "Message sent successfully",
            },
            { status: 200 }
        );
    } catch (err) {
        console.log(err);

        return Response.json(
            {
                success: false,
                message: "Unable to send message",
            },
            { status: 500 }
        );
    }
}