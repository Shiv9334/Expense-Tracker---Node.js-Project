const User = require("../models/user");
const Expense = require("../models/expense");
const sequelize = require("../util/database");
const express = require("express");

async function getAllUsersWithExpenses(req, res) {
  try {
    const userWithExpenses = await User.findAll({
      attributes: [
        "id",
        "name",
        [sequelize.fn("sum", sequelize.col("amount")), "totalExpense"],
      ],
      include: [
        {
          model: Expense,
          attributes: [],
        },
      ],
      group: ["User.id"],
      order: [["totalExpense", "DESC"]],
    });
    res.status(200).json(userWithExpenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getAllUsersWithExpenses };
