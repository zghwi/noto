import { createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import { FLASHCARDS_PROMPT, QUIZ_PROMPT } from "./prompts";

export default class AI {
    ai: GoogleGenAI;
    file: string;
    mimeType: string;

    constructor(file: string, mimeType: string) {
        this.ai = new GoogleGenAI({
            apiKey: process.env["NEXT_PUBLIC_GEMINI_API_KEY"]
        });
        this.file = file;
        this.mimeType = mimeType;
    }

    private base64ToBlob(data: string, mimeType: string) {
        const byteCharacters = atob(data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }

    async generate(type: "quiz" | "flashcards", q: number) {
        const file = await this.ai.files.upload({
            file: this.base64ToBlob(this.file, this.mimeType),
        });
        const res = await this.ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                createUserContent([
                    type === "quiz" ? QUIZ_PROMPT(q) : FLASHCARDS_PROMPT(q),
                    createPartFromUri(file.uri as string, file.mimeType as string)
                ])
            ]
        });

        let raw = res.text?.replaceAll("```", "") as string;
        return raw;
    }
}