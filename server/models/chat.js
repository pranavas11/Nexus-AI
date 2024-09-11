import { text } from "express";
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        history: [
            {
                role: {
                    type: String,
                    enum: ["user", "model"],
                    required: true,
                },
                parts: [
                    {
                        text: {
                            type: String,
                            required: true,
                        },
                    }
                ],
                img: {
                    //type: String,
                    type: [String], // Allow an array of strings to store multiple image URLs
                    required: false,
                }
            }
        ],
    },
    { timestamps: true }
);

export default mongoose.models.chat || mongoose.model("chat", chatSchema);