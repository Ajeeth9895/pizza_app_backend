var express = require('express');
var router = express.Router();
const { UserModel } = require('../schema/userSchema')
const { OrderModel } = require('../schema/orderSchema')
const { ProductModel } = require('../schema/productSchema')
const { dbUrl } = require('../config/dbConfig')
const { hashPassword, hashCompare, createToken, decodeToken, validate, roleAdmin, forgetPasswordToken, decodePasswordToken } = require('../config/auth');
const mongoose = require('mongoose');

// connect database
mongoose.connect(dbUrl)

// admin login
router.post("/adminLogin", async (req, res) => {
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

router.get('/getDashboard', validate, roleAdmin, async (req, res) => {
    try {
        let products = await OrderModel.find()

        res.status(200).send({
            products
        });
        // console.log(products);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "internal server error",
            error,
        });
    }
});

router.get('/getOrder', validate, async (req, res) => {
    try {
        let products = await OrderModel.find()

        res.status(200).send({
            products
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "internal server error",
            error,
        });
    }
});


router.get('/getProducts', validate, async (req, res) => {
    try {
        let values = await ProductModel.find()

        res.status(200).send({
            values
        });


    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "internal server error",
            error,
        });
    }
});


//create product
router.post('/create-product',validate, async (req, res) => {
    try {

        let product = await ProductModel.findOne({ name: req.body.name });

        if (!product) {

            let doc = new ProductModel(req.body);
            await doc.save();
            res.status(201).send({
                message: "Product Added successfully",
            });
        } else {
            res.status(400).send({
                message: "Product already exists",
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


router.post('/order-Status', async (req, res) => {
    try {
        let products = await OrderModel.findByIdAndUpdate({ _id: req.body.OrderId }, { status: req.body.Status });

        res.status(200).send({
            message:"Status changed successfully"
        });
      

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "internal server error",
            error,
        });
    }
});


module.exports = router;