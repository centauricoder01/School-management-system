const { authModel } = require("../Models/Auth.models");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const signupUser = async (req, res) => {
  const { userName, email } = req.body;

  let checkEmail = await authModel.findOne({ email });

  if (checkEmail) {
    return res.send({ message: "user already exist." });
  }

  let Password = "AC" + Math.floor(1000 + Math.random() * 90000000) + "DC";

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rajendrapatelofficial@gmail.com",
      pass: "mbmqczvfbrcexwdh",
    },
  });

  const mailOptions = {
    from: "rajendrapatelofficial@gmail.com",
    to: email,
    subject: "This is your Password, Don't Share it.",
    html: `<h3>Hi ${userName},</h3><p>This is the password <strong>${Password}</strong> to login to TalkHub.</p>
    <p>share TalkHub with your friends so that you can have a better experience.</p>
    <p>You can modify or change your password anytime.</p>
    <p>Thanks.</p>
    `,
  };

  bcrypt.hash(Password, 10, async function (err, hash) {
    if (hash) {
      const saveDetails = new authModel({ userName, email, Password });
      await saveDetails.save();

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        }
      });

      res.send({ message: "user added successfully", hash });
    } else {
      console.log(err);
    }
  });
};

module.exports = { signupUser };
