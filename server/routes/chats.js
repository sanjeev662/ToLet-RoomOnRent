const express = require("express");
const asyncHandler = require("express-async-handler");
const fetchUser = require("../middleware/fetchUserFromToken.js");
const Chat = require("../models/ChatModel.js");
const Message = require("../models/MessageModel");
const User = require("../models/User");

const Router = express.Router();

////////////////////get user search Chat//////////////////////

Router.get("/user",fetchUser,asyncHandler(async(req,res) => {
  const keyword = req.query.search
  ?{
      $or:[
          { username : { $regex : req.query.search, $options: "i" }},
          { email : { $regex : req.query.search, $options: "i" }},
      ],
  }
  : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.userId } });
  res.send(users);
}));

////////////////////accessChat//////////////////////

Router.post(
  "/",fetchUser,
  asyncHandler(async (req, res) => {
    const { guestuserId } = req.body;
    if (!guestuserId) {
      return res.sendStatus(400);
    }

    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.userId } } },
        { users: { $elemMatch: { $eq: guestuserId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "username pic email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.userId, guestuserId],
      };

      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).json(FullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
  })
);

////////////////////fetchChats//////////////////

Router.get(
  "/",fetchUser,
  asyncHandler(async (req, res) => {
    try {
      let results = await Chat.find({ users: { $elemMatch: { $eq: req.userId } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

      results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "username pic email",
      });
      res.status(200).send(results);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  })
);

//////////////create group chat///////////////////////////////////

Router.post(
  "/group",
  fetchUser,
  asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }

    users.push(req.userId);

    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.userId,
      });

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  })
);

/////////////////////////rename group////////////////////////////

Router.put(
  "/rename",
  fetchUser,
  asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(updatedChat);
    }
  })
);

//////////////////////remove from group//////////////////////////

Router.put(
  "/removefromgroup",
  fetchUser,
  asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(removed);
    }
  })
);

//////////////////////////add to group///////////////////////////

Router.put(
  "/addtogroup",
  fetchUser,
  asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(added);
    }
  })
);

//////////////////get all message//////////////////////////////

Router.get(
  "/message/:chatId",
  fetchUser,
  asyncHandler(async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "username pic email")
        .populate("chat");
      res.json(messages);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  })
);

////////////////// send message ///////////////////////////////

Router.post(
  "/message",
  fetchUser,
  asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      return res.sendStatus(400);
    }

    var newMessage = {
      sender: req.userId,
      content: content,
      chat: chatId,
    };

    try {
      var message = await Message.create(newMessage);

      message = await message.populate("sender", "username pic");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "username pic email",
      });

      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

      res.json(message);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  })
);

module.exports = Router;
