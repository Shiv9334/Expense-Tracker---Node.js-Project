const Razorpay = require("razorpay");
const Order = require("../models/order");

exports.purchaseMembership = async (req, res, next) => {
  try {
    var rzp = new Razorpay({
      key_id: "rzp_test_M68koKsdybYs1S",
      key_secret: "HRBVaEQZnqT99ZD2qwlaacrn",
    });
    const amount = 50000;

    const order = await rzp.orders.create({ amount, currency: "INR" });

    await req.user.createOrder({ orderId: order.id, status: "Pending" });

    return res.status(201).json({ order, key_id: rzp.key_id });
  } catch (err) {
    res.status(403).json({ message: "something went wrong", error: err });
  }
};

exports.transactionUpdate = async (req, res, next) => {
  try {
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderId: order_id } });

    const promise1 = order.update({
      paymentId: payment_id,
      status: "Successfull",
    });
    const promise2 = req.user.update({ isPremiumUser: true });

    Promise.all([promise1, promise2])
      .then(() => {
        return res
          .status(202)
          .json({ success: true, message: "Transaction Successfull" });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

exports.transactionUpdate = async (req, res, next) => {
  try {
    console.log(req.body.order_id);
    const orderid = req.body.order_id;
    const order = await Order.findOne({ where: { orderid: orderid } });
    order.update({ status: "FAILED" });
    return res.status(403).json({ message: "Transaction Failed" });
  } catch (err) {
    console.log(err);
  }
};
/*
 key_id: "rzp_test_j1vwrEX169mrj5",
      key_secret: "I5ijT1ke8cig1WP6wdi6EEy4",


const Razorpay = require("razorpay");
const Order = require("../models/order.js");

exports.purchaseMembership = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: "rzp_test_j1vwrEX169mrj5",
      key_secret: "I5ijT1ke8cig1WP6wdi6EEy4",
    });
    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      req.user
        .createOrder({ orderId: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Sometghing went wrong", error: err });
  }
};

exports.transactionUpdate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderId: order_id } }); //2
    const promise1 = order.update({
      paymentid: payment_id,
      status: "SUCCESSFUL",
    });
    const promise2 = req.user.update({ isPremiumUser: true });

    Promise.all([promise1, promise2])
      .then(() => {
        return res
          .status(202)
          .json({ sucess: true, message: "Transaction Successful" });
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: err, message: "Sometghing went wrong" });
  }
};
*/
