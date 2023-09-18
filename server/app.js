const express = require("express");
const cors = require("cors");

const sequelize = require("./util/database");

const User = require("./models/user");
const Messages = require("./models/messages");

const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/messages");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json({ extended: false }));

app.use("/user", userRoutes);
app.use("/message", messageRoutes);

User.hasMany(Messages);
Messages.belongsTo(User);

sequelize
  .sync()
  //   .sync({ force: true })
  .then(() => {
    app.listen(3000, () => {
      console.log("App running at port 3000");
    });
  });
