import express from "express";
import { getMessages,getUsersForSidebar, markMessageSeen, sendMessage } from "../controllers/messageController.js";
import { protectRoute } from "../middleware/auth.js";

const messageRouter = express.Router();

// GET all user for sidebar
messageRouter.get("/users", protectRoute, getUsersForSidebar);

// GET all messages between logged-in user and selected user
messageRouter.get("/:id", protectRoute, getMessages);

// PATCH - mark a single message as seen by ID
messageRouter.patch("/mark/:id", protectRoute, markMessageSeen);

//POST messages to receiver
messageRouter.post("/send/:id",protectRoute,sendMessage)

export default messageRouter;
