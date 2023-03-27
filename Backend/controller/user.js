const User = require("../models/user");

exports.postUser = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        return res.status(409).json({ error: "User already exist" });
      }
      User.create({
        name: name,
        email: email,
        password: password,
      })
        .then((result) => {
          return res.json(result);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ error: "Internal Server Error" });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    });
};
