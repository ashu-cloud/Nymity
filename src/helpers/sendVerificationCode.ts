import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
    maxRetries = 3
): Promise<ApiResponse> {
    try {
        // 1. Configure the free Gmail SMTP transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // 2. Preserve your exact template by converting the React component to HTML
        const emailHtml = await render(VerificationEmail({ username, otp: verifyCode }));

        const mailOptions = {
            from: `"Nymity Security" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Nymity | Your Verification Code",
            html: emailHtml,
        };

        // 3. Robust Retry Logic (Zero-Failure Implementation)
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const info = await transporter.sendMail(mailOptions);
                console.log(`[EMAIL SUCCESS] Attempt ${attempt} - Sent to ${email} (ID: ${info.messageId})`);

                return { success: true, message: "Verification email sent successfully" };
            } catch (error) {
                console.error(`[EMAIL ERROR] Attempt ${attempt} failed for ${email}:`, error);

                if (attempt === maxRetries) {
                    throw new Error("Maximum email retry attempts reached.");
                }

                // Wait 1.5 seconds before trying again (Exponential fallback-ish)
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        }

        return { success: false, message: "Verification email failed after retries" };
    } catch (err) {
        console.error("[EMAIL CRITICAL ERROR] The email transporter crashed:", err);
        return { success: false, message: "Verification email failed to initialize" };
    }
}