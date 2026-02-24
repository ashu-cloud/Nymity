export async function POST() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return Response.json({ success: false, message: "Missing GEMINI_API_KEY" }, { status: 500 });
        }

        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform and should avoid sensitive topics.";

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ Raw Google API Error:", data);
            return Response.json({
                success: false,
                message: data.error?.message || "Google API Error"
            }, { status: response.status });
        }

        const responseText = data.candidates[0].content.parts[0].text;

        return Response.json({
            success: true,
            suggestion: responseText
        }, { status: 200 });

    } catch (error) {
        console.error("Network Error:", error);
        return Response.json({ success: false, message: "Failed to connect to AI" }, { status: 500 });
    }
}