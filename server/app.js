const express = require("express");
const cors = require("cors");

const sequelize = require("./util/database");

const userRoutes = require("./routes/user");

const app = express();

app.use(cors());
app.use(express.json({ extended: false }));

app.use("/user", userRoutes);

sequelize
  .sync()
  //   .sync({ force: true })
  .then(() => {
    app.listen(3000, () => {
      console.log("App running at port 3000");
    });
  });
