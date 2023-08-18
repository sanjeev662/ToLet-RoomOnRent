const express = require("express");
const connectToMongo = require("./db");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
connectToMongo();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDINARYSECRET,
});

// Available routes
app.use('/auth', require('./routes/auth'))
app.use('/fogotpassword', require('./routes/forgotpass'));
app.use('/oauth', require('./routes/oauth'));
app.use('/testimonial', require('./routes/testimonial'))

app.use('/hosting',require('./routes/hosting'));
app.use('/booking',require('./routes/booking'));
app.use('/places',require('./routes/places'));

app.use('/chats',require('./routes/chats'));

// Start the server
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


////////////////////////// real time chat functionality started //////////////////////////////
////////////////////////// real time chat functionality started //////////////////////////////

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://to-let-room-on-rent.vercel.app",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("user joined room"+ userData.email);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room"+ room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

//////////////////////////real time chat functionality ended//////////////////////////////
//////////////////////////real time chat functionality ended//////////////////////////////