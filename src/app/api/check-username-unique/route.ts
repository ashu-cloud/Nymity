import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/user";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(req: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);

        const queryParam = {
            username: searchParams.get("username"),
        };

        // Validate with Zod
        const result = usernameQuerySchema.safeParse(queryParam);

        if (!result.success) {
            const usernameError =
                result.error.format().username?._errors[0] ||
                "Invalid username";

            return Response.json(
                {
                    success: false,
                    message: usernameError,
                },
                { status: 400 }
            );
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username already exists",
                },
                { status: 400 }
            );
        }

        return Response.json(
            {
                success: true,
            },
            { status: 200 }
        );
    } catch (e) {
        console.error(e);

        return Response.json(
            {
                success: false,
                message: "Error checking username",
            },
            { status: 500 }
        );
    }
}