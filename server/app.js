const express = require("express");
const cors = require("cors");

const sequelize = require("./util/database");

const User = require("./models/user");
const Messages = require("./models/messages");
const Group = require("./models/group");
const UserGroup = require("./models/userGroup");

const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/messages");
const groupRoutes = require("./routes/group");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json({ extended: false }));

app.use("/user", userRoutes);
app.use("/message", messageRoutes);
app.use("/group", groupRoutes);

User.hasMany(Messages);
Messages.belongsTo(User);
Group.hasMany(Messages, { as: "messages" });
Messages.belongsTo(Group);
User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    app.listen(3000, () => {
      console.log("App running at port 3000");
    });
  });
