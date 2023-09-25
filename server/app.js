const express = require("express");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");

const sequelize = require("./util/database");

const User = require("./models/user");
const Messages = require("./models/messages");
const Group = require("./models/group");
const UserGroup = require("./models/userGroup");

const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/messages");
const groupRoutes = require("./routes/group");

const configureSocket = require("./socket/index");

const app = express();
const server = http.createServer(app);
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// app.use(cors());

dotenv.config({ path: "./.env" });
app.use(express.json({ extended: false }));

app.use("/user", userRoutes);
app.use("/message", messageRoutes);
app.use("/group", groupRoutes);

User.hasMany(Messages);
Messages.belongsTo(User);
Group.hasMany(Messages);
Messages.belongsTo(Group);
User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

const io = configureSocket(server);

sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    server.listen(3000, () => {
      console.log("App running at port 3000");
    });
  });

module.exports = { io };
