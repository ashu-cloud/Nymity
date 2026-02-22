import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform and should avoid sensitive topics.`,
                        },
                    ],
                },
            ],
            generationConfig: {
                maxOutputTokens: 100,
                temperature: 0.8,
            },
        });

        const response = result.response.text();

        return Response.json({
            success: true,
            suggestion: response,
        });
    } catch (error) {
        console.error(error);

        return Response.json(
            { success: false, message: "Failed to generate suggestion" },
            { status: 500 }
        );
    }
}