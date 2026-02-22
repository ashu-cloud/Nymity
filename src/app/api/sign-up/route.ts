import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationCode";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        const userNameExists = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (userNameExists) {
            return Response.json(
                { success: false, message: "Username already exists" },
                { status: 400 }
            );
        }

        const existingUser = await UserModel.findOne({ email });
        const verifyCode = Math.floor(10000 + Math.random() * 90000).toString();
        const expiryDate = new Date(Date.now() + 3600000);

        if (existingUser) {
            if (existingUser.isVerified) {
                return Response.json(
                    { success: false, message: "User already exists with this email" },
                    { status: 400 }
                );
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            existingUser.password = hashedPassword;
            existingUser.verifyCode = verifyCode;
            existingUser.verifyCodeExpires = expiryDate;

            await existingUser.save();
        } else {
            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpires: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            });

            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        if (!emailResponse.success) {
            return Response.json(
                { success: false, message: "Error sending verification email" },
                { status: 500 }
            );
        }

        return Response.json(
            { success: true, message: "Verification email sent successfully" },
            { status: 200 }
        );
    } catch (err) {
        console.log("Error", err);
        return Response.json(
            { success: false, message: "Failed to Sign Up" },
            { status: 500 }
        );
    }
}