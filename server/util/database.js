const Sequelize = require("sequelize");

const sequelize = new Sequelize("group_chat", "root", "Prem@5522", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
