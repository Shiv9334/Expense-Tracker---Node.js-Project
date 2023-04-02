const express = require("express");
const router = express.Router();

const purchaseController = require("../controller/purchase");
const userAuthenticate = require("../middleware/auth");

router.get(
  "/purchase/premium",
  userAuthenticate.authenticate,
  purchaseController.purchaseMembership
);
router.post(
  "/purchase/updatetransactionstatus",
  userAuthenticate.authenticate,
  purchaseController.transactionUpdate
);

module.exports = router;
