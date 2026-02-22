import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/user";
import { usernameValidation } from "@/schemas/signUpSchema";

export async function POST(req: Request, res: Response) {
    await dbConnect()
    try{

        const {username , code} = await req.json()

        const decodedUsername =decodeURIComponent(username)
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
                sucess: true,
                message: "User Verification Completed Successfully",
            }, {status: 200})
        }
        else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification Code is Expired",
            })
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