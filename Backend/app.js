const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");

app.use(cors());

const signUpRoute = require("./routes/signup");
const loginRoute = require("./routes/login");

app.use(bodyParser.json({ extended: false }));
app.use(signUpRoute);
app.use(loginRoute);

sequelize
  .sync()
  .then((result) => {
    console.log(result);
    app.listen(4000);
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
