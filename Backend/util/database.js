const Sequelize = require("sequelize");

const sequelize = new Sequelize("expense-tracker", "root", "9122892311", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
