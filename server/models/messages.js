const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Messages = sequelize.define("message", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  message: Sequelize.STRING,
});

module.exports = Messages;
