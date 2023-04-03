const User = require("../models/user");
const Expense = require("../models/expense");
const sequelize = require("../util/database");
const express = require("express");

async function getAllUsersWithExpenses(req, res) {
  try {
    const users = await User.findAll({
      attributes: ["name", "totalExpense"],
      order: [["totalExpense", "DESC"]],
    });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { getAllUsersWithExpenses };
