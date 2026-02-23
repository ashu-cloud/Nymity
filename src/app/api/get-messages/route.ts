import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from 'next-auth';
import mongoose from "mongoose";

export async function GET(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            { success: false, message: "Not Authenticated" },
            { status: 401 }
        );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        // Corrected Aggregation Pipeline
        const userResults = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } },
        ]);

        if (!userResults || userResults.length === 0) {
            return Response.json(
                { success: true, messages: [] }, // Return an empty array if they have no messages
                { status: 200 }
            );
        }

        return Response.json(
            { success: true, messages: userResults[0].messages },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in get-messages:", error);
        return Response.json(
            { success: false, message: "Error retrieving messages" },
            { status: 500 }
        );
    }
}