const User = require("../models/user");
const Sib = require("sib-api-v3-sdk");
const ForgotPasswordRequest = require("../models/ForgotPasswordRequest");
const bcrypt = require("bcrypt");
require("dotenv").config();

const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.API_KEY;
const sender = {
  email: "shivkumar9334@gmail.com",
  name: "Shiv Kumar",
};

exports.postForgetPassword = async (req, res, next) => {
  const email = req.body.email;
  console.log(email);
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(409).json({ error: "User does not exist" });
    } else {
      const reset = await ForgotPasswordRequest.create({
        isActive: true,
        userId: user.id,
      });
      const tranEmailApi = new Sib.TransactionalEmailsApi();
      const receivers = [
        {
          email: email,
        },
      ];
      const response = await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "Password Reset Link",
        textContent: `Please click on the link to reset your password.`,
        htmlContent: `<p>Please click the link below to reset your password.
                if not done by you, please change your password</p> 
                <a href="http://localhost:4000/password/resetpassword/${reset.id}">Reset link</a>`,
      });
      console.log(response);
      return res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);
    return res.status(409).json({ error: "User does not exists" });
  }
};

exports.getUpdatePassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(req.query);
    const newpassword = req.query.newpassword;
    const result = await ForgotPasswordRequest.findOne({ where: { id: id } });
    const user = await User.findOne({ where: { id: result.userId } });

    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) {
        console, log(err);
        throw new Error(err);
      }
      bcrypt.hash(newpassword, salt, function (err, hash) {
        //Store hash in your DB
        if (err) {
          console.log(err);
          throw new Error(err);
        }
        user.update({ password: hash }).then(() => {
          res
            .status(201)
            .json({ message: "You Successfully updated the new password" });
          res.update({
            isActive: false,
          });
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
};
