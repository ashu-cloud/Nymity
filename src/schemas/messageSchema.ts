import {z} from "zod";

export const messageSchema = z.object({
    content : z.string().max(300, {message: "The content should not be more than 300 words"})
})
