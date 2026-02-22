import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import {User} from 'next-auth';
import mongoose from "mongoose";


export async function GET(req: Request, res: Response){
    await dbConnect();
    const session = await getServerSession(authOptions)

    const user = session?.user as User;

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message:"not Authenticated",
        },{status:401})
    }
    const userId = new mongoose.Types.ObjectId(user._id);

    try{

        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            {$unwind: "$message"},
            {$sort: { createdAt: -1 }},
            {$group : {_id: '$id', messages:{$push: '$message'}}},
        ]);

    }catch(error){
        console.error(error);
        return Response.json({
            success: false,
            message: "Error in Getting messages + ",
        })
    }
}