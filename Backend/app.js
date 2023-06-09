const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");

app.use(cors());
const helmet = require("helmet");
const morgan = require("morgan");

const signUpRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const expenseRoute = require("./routes/expense");
const purchaseRoute = require("./routes/purchase");
const premiumRoutes = require("./routes/premium");
const forgetPasswordRoute = require("./routes/forgetPassword");
const passwordResetRoute = require("./routes/resetlink");
const User = require("./models/user");
const UserExpense = require("./models/expense");
const Order = require("./models/order");
const DownloadLink = require("./models/download");
const ForgotPasswordRequest = require("./models/ForgotPasswordRequests");

/*const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
); */

/*app.use(helmet());
//app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("combined"));*/

app.use(bodyParser.json({ extended: false }));
app.use(signUpRoute);
app.use(loginRoute);
app.use(expenseRoute);
app.use(purchaseRoute);
app.use(premiumRoutes);
app.use(forgetPasswordRoute);
app.use(passwordResetRoute);

User.hasMany(UserExpense);
UserExpense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

User.hasMany(DownloadLink);
DownloadLink.belongsTo(User);

console.log(process.env.NODE_ENV);

sequelize
  // .sync({ alter: true })
  .sync()
  .then((result) => {
    console.log(result);
    app.listen(process.env.PORT || 4000);
  })
  .catch((err) => {
    console.log(err);
  });

async function authenticate() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully!");
  } catch (err) {
    console.error("Unable to connect to the database", err);
  }
}

authenticate();
