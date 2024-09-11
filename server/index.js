import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import mongoose from "mongoose";
import ImageKit from "imagekit";
import url, { fileURLToPath } from "url";
import path from "path";
import UserChats from "./models/userChats.js";
import Chat from "./models/chat.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB!");
    } catch (err) {
        console.log(err);
    }
};

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
});

app.get("/", (req, res) => {
    res.send("Hello from Backend!");
})

app.get("/api/upload", (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
});

app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    const { text } = req.body;

    try {
        // create a new chat
        const newChat = new Chat({
            userId: userId,
            history: [{ role: "user", parts: [{ text }] }],
        });

        const savedChat = await newChat.save();

        // check if user chat exists
        const userChats = await UserChats.find({ userId: userId });

        // if the user chat doesn't already exist, create a new one and add it to the chats array
        if (!userChats.length) {
            const newUserChat = new UserChats({
                userId: userId,
                chats: [
                    {
                        _id: savedChat._id,
                        title: text.substring(0, 30),
                    }
                ],
            });

            await newUserChat.save();
        } else {
            // if the chat alreay exists, push the chat (current conversation) to the existing array
            await UserChats.updateOne(
                { userId: userId },
                {
                    // $push is used to append a new chat object to the existing chats array within a document in the MongoDB collection
                    $push: {
                        chats: {
                            _id: savedChat._id,
                            title: text.substring(0, 30),
                        },
                    },
                },
            );

            res.status(201).send(newChat._id);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error creating chat! :( Please try again later.");
    }
});

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;

    try {
        const userChats = await UserChats.find({ userId });

        if (userChats.length === 0) {
            res.status(200).send([]);                       // respond with an empty array
        } else {
            res.status(200).send(userChats[0].chats);       // send the chats list
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching userchats. Please try again.");
    }
});

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;

    try {
        const chat = await Chat.findOne({ _id: req.params.id, userId });
        res.status(200).send(chat);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching chat!");
    }
});

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    const { question, answer, img } = req.body;

    const newItems = [
        ...(question ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }] : []),
        { role: "model", parts: [{ text: answer }] },
    ];

    try {
        const updatedChat = await Chat.updateOne(
            { _id: req.params.id, userId },
            {
                $push: {
                    history: { $each: newItems },
                },
            },
        );
        res.status(200).send(updatedChat);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding conversation. Please try again.");
    }
});

// DELETE request to delete a chat and its associated history
app.delete("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    const chatId = req.params.id;

    try {
        // Delete the chat history
        const deletedChat = await Chat.findOneAndDelete({ _id: chatId, userId });
        if (!deletedChat) {
            return res.status(404).send("Chat not found");
        }

        // Remove the chat from user's chat list
        await UserChats.updateOne(
            { userId },
            { $pull: { chats: { _id: chatId } } }
        );

        res.status(200).send({ message: "Chat deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).send("Failed to delete the chat.");
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(401).send("Unauthenticated!");
});

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

app.listen(port, () => {
    connect();
    console.log("Server is running on port 3000!");
});