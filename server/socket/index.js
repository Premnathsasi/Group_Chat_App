const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const Message = require("../models/messages");
const User = require("../models/user");
const Group = require("../models/group");
const UserGroup = require("../models/userGroup");

const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.query.token;

    try {
      const user = jwt.verify(token, "a454a5478a4s5d1d21d54d88fr");
      socket.userId = user.id;
      next();
    } catch (err) {
      console.error(err);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("send-message", async (message) => {
      try {
        const savedMessages = await Message.create({
          message: message.text,
          userId: socket.userId,
          groupId: message.groupId,
        });
        if (savedMessages) {
          const response = await User.findByPk(socket.userId, {
            attributes: ["name"],
          });
          io.emit("receive-message", {
            ...savedMessages.toJSON(),
            user: { name: response.name },
          });
        }
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("login", async (token) => {
      try {
        const data = await User.findByPk(socket.userId, {
          attributes: ["name"],
          include: [
            {
              model: Group,
            },
          ],
        });
        if (data) {
          io.emit("initial-list", data);
        }
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
  return io;
};

module.exports = configureSocket;
