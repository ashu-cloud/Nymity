import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from 'next-auth';
import mongoose from "mongoose";

export async function DELETE(
    req: Request,
    { params }: { params: { messageid: string } }
) {
    // 1. Check Authentication FIRST (Saves database resources!)
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated",
        }, { status: 401 });
    }

    const user = session.user as User;
    const messageId = params.messageid;

    // 2. Validate the message ID format before touching the database
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        return Response.json({
            success: false,
            message: "Invalid Message ID format.",
        }, { status: 400 });
    }

    // 3. Now it is safe to connect to the database
    await dbConnect();

    try {
        // 4. Explicitly cast the string to an ObjectId for the $pull operator
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } } }
        );

        if (updatedResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted.",
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "Message deleted successfully!",
        }, { status: 200 });

    } catch (err) {
        console.error("Error deleting message:", err);
        return Response.json({
            success: false,
            message: "An unexpected error occurred while deleting the message.",
        }, { status: 500 });
    }
}