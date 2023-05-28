var express = require('express');
var router = express.Router();
const { UserModel } = require('../schema/userSchema')
const { dbUrl } = require('../config/dbConfig')
const { hashPassword, hashCompare, createToken, decodeToken, validate, roleAdmin, forgetPasswordToken, decodePasswordToken } = require('../config/auth');
const mongoose = require('mongoose');
const { passwordEmail } = require('../service/passwordEmail')
const jwt = require("jsonwebtoken");
require('dotenv').config()


//connect to db
mongoose.connect(dbUrl)

let URL = 'https://sensational-vacherin-4870e4.netlify.app'

//Creating users
router.post('/signUp', async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      req.body.password = await hashPassword(req.body.password);
      let doc = new UserModel(req.body);
      await doc.save();
      res.status(201).send({
        message: "User Added successfully please login",
      });
    } else {
      res.status(400).send({
        message: "Email already exists",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal server error",
      error,
    });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });

    if (user) {
      if (await hashCompare(req.body.password, user.password)) {
        let token = await createToken({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        });

        res.status(200).send({
          message: "Login successfully",
          token,
          role: user.role,
          user
        });
      } else {
        res.status(400).send({
          message: "Invalid Credential",
        });
      }
    } else {
      res.status(400).send({
        message: "Email does not exists",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal server error",
      error,
    });
  }
});


//send email
router.post("/send-email", async (req, res) => {

  try {
    let user = await UserModel.findOne({ email: req.body.email });

    if (user) {
    
      let firstName = user.firstName
      let email = user.email

      // creating token       
      let token = jwt.sign({ firstName, email }, process.env.SECRETE_KEY_RESET, {
        expiresIn: process.env.FORGOT_EXPIRES
      });

      const setUserToken = await UserModel.findByIdAndUpdate({ _id: user._id }, { token: token });


      await passwordEmail({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        message: `${URL}/reset-password/${user._id}/${setUserToken.token}`
      })

      res.status(200).send({
        message: "Email send successfully",
      });

    } else {
      res.status(400).send({
        message: "Email does not exists",
      });
    }

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal server error",
      error,
    });
  }
});


//verify token for reset password
router.get("/reset-password/:id/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const data = await decodePasswordToken(token);

    if (Math.floor(Date.now() / 1000) <= data.exp) {
      res.status(200).send({
        message: "Valid user"
      })
    } else {
      res.status(401).send({
        message: "Token expired"
      })
    }


  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal server error",
      error,
    });
  }
});



//change password
router.post("/change-password/:id/:token", async (req, res) => {
  try {
    let token = req.params.token;
    const _id = req.params.id;
    var password = req.body.password

    var changePass = await hashPassword(password);

    const updatePassword = await UserModel.updateOne({ _id: _id }, { $set: { password: changePass } });

    res.status(200).send({
      message: 'Password updated successfully'
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal server error",
      error,
    });
  }
});

module.exports = router;
