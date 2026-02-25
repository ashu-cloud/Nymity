import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/user";
import { usernameValidation } from "@/schemas/signUpSchema";

// The fix: Removed `, res: Response` from the parameters
export async function POST(req: Request) {
    await dbConnect()
    try{

        const {username , code} = await req.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername})

        if(!user){
            return Response.json({
                success: false,
                message: "User not found",
            },{status: 404})

        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpires) > new Date()
        if(!isCodeValid){
            return Response.json({
                success: false,
                message: "Code not valid",
            },{status: 500})
        }
        if(isCodeNotExpired && isCodeValid){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "User Verification Completed Successfully",
            }, {status: 200})
        }
        else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification Code is Expired",
            },{status: 400})
        }

    }catch(error){
        console.error(error);

        return Response.json(
            {
                success: false,
                message: "Error Verifying User",
            },
            { status: 500 }
        );

    }
}