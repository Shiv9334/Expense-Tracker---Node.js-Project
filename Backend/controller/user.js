const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.postSignUpUser = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      return res.status(409).json({ error: "User already exist" });
    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.log(err);
      }
      const result = await User.create({
        name: name,
        email: email,
        password: hash,
      });
      return res.json(result);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
function geenerateToken(id) {
  return jwt.sign({ userId: id }, "9755445544vcvfv8644");
}
exports.postLoginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    return res.status(200).json({ token: geenerateToken(user.id) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
