import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, { message: "Username must be at least 2 characters" })
    .max(20, { message: "Username must not exceed 20 characters" });

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Email address is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});