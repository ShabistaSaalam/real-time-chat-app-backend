import Message from "../models/message.js"
import User from "../models/User.js"
import connectCloudinary from "../lib/cloudinary.js"
import { io,userSocketMap } from "../server.js"

//get all users except for logged in user
export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id
        const filteredUser = await User.find({ _id: { $ne: userId } }).select("-password")
        //count number of messages not scene
        const unseenMessages = {}
        const promises = filteredUser.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false })
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length
            }

        })
        await Promise.all(promises)
        res.json({ success: true, users:filteredUser, unseenMessages })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}
//get all messages for selected user
export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 }); // sort by oldest first

        await Message.updateMany({senderId:selectedUserId,receiverId:myId},{seen:true})
        res.status(200).json({
            success: true,
            messages
        });
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//api to mark message as seen using message id
export const markMessageSeen = async (req, res) => {
  try {
    const { id:messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    message.seen = true;
    await message.save();

    res.status(200).json({ success: true, message: "Message marked as seen", data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id; // from auth middleware
    const { text, image } = req.body;
    const receiverId=req.params.id
    if (!receiverId || (!text && !image)) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID and at least one of text or image are required.",
      });
    }

    let imageUrl;
    if(image){
        const uploadResponse= await connectCloudinary.uploader.upload(image)
        imageUrl=uploadResponse.secure_url
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl || "",
    });

    //Emit the new message to the receiver's socket
    const receiverSocketId=userSocketMap[receiverId]
    if(receiverSocketId){
      io.to(receiverSocketId).emit('newMessage',newMessage)
    }
    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
