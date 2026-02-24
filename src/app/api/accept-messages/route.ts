import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import {User} from 'next-auth';



export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)

    const user = session?.user as User;

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message:"not Authenticated",
        },{status:401})
    }
    const userId = session.user._id;

    const {acceptMessages} = await request.json();

    try{

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessages},
            {new:true}
        )
        if(!updatedUser) {
            return Response.json({
                success: false,
                message:"User not found",
            },{status:401})
        }

        return Response.json({
            success: true,
            message: `Message acceptance is now ${acceptMessages ? 'ON' : 'OFF'}`,
            updatedUser
        },{status:200})

    }catch(error){
        console.error(error);
        return Response.json({
            success: false,
            message:"Failed to update User status to accept Message",
        },{status:500})
    }
}


export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)

    const user = session?.user as User;

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message:"not Authenticated",
        },{status:401})
    }
    const userId = session.user._id;
    try {
        const foundUser =await UserModel.findById(userId)
        if(!foundUser) {
            return Response.json({
                success: false,
                message:"User not found",
            },{status:404})
        }

        return Response.json({
            success: true,
            message:"User found",
            isAcceptingMessages: foundUser.isAcceptingMessage
        })

    }catch(error){
        console.error(error);
        return Response.json({
            success: false,
            message:"Failed to get user",
        },{status:500})
    }

}