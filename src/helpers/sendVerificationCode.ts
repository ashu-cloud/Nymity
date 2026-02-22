import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import {ApiResponse} from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const response = await resend.emails.send({
            from: "Nymity <onboarding@resend.dev>",
            to: email,
            subject: "Verification Code",
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        console.log("Resend response:", response);

        return { success: true, message: "Verification email sent" };
    } catch (err) {
        console.log("Error sending email:", err);
        return { success: false, message: "Verification email failed" };
    }
}