const Razorpay = require("razorpay");
const Order = require("../models/order");

exports.purchaseMembership = async (req, res, next) => {
  try {
    const rzp = new Razorpay({
      key_id: "rzp_test_wumMVPEk38YSUt",
      key_secret: "85MDLyAE5PkEUE3ZB96hlsPh",
    });
    const amount = 500;

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
        throw new Error(err);
      });
  } catch (err) {
    console.log(err);
    const { payment_id, order_id } = req.body;
    console.log(order_id);
    const order = await Order.findOne({ where: { orderId: order_id } });
    await order.update({ status: "Failed" });
    return res.status(403).json({ message: "Transaction Failed", error: err });
  }
};
