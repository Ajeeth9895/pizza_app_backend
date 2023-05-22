var express = require('express');
var router = express.Router();
const { UserModel } = require('../schema/userSchema')
const { OrderModel } = require('../schema/orderSchema')
const { ProductModel } = require('../schema/productSchema')
const {AdminModel} = require('../schema/adminSchema')
const { dbUrl } = require('../config/dbConfig')
const { hashPassword, hashCompare, createToken, decodeToken, validate, roleAdmin, forgetPasswordToken, decodePasswordToken } = require('../config/auth');
const mongoose = require('mongoose');

// connect database
mongoose.connect(dbUrl)


// admin login
router.post("/adminLogin", async (req, res) => {
    try {
        let user = await AdminModel.findOne({ email: req.body.email });

        if (user) {
            if (user.role === "admin") {
                if (await hashCompare(req.body.password, user.password)) {
                    let token = await createToken({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: user.role,
                    });

                    res.status(200).send({
                        message:"Admin login successfully",
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
                    message: "Admin can only access",
                });
            }
        } else {
            res.status(400).send({
                message: "Admin can only access",
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


//Creating admin
router.post('/adminSignUp', async (req, res) => {
    try {

      let user = await AdminModel.findOne({ email: req.body.email });
  
      if (!user) {
        req.body.password = await hashPassword(req.body.password);
        let doc = new AdminModel(req.body);
        await doc.save();
        res.status(201).send({
          message: "Admin added successfully",
        });
      } else {
        res.status(400).send({
          message: "Email already exists",
        });
      }

    console.log(user);

    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "internal server error",
        error,
      });
    }
  });


//get order details
router.get('/getOrder', validate,roleAdmin, async (req, res) => {
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


//get all products
router.get('/getProducts', validate,roleAdmin, async (req, res) => {
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
router.post('/create-product', async (req, res) => {
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

//change status pending to delivery
router.post('/order-Status', async (req, res) => {
    try {
        let products = await OrderModel.findByIdAndUpdate({ _id: req.body.OrderId }, { status: req.body.Status });

        res.status(200).send({
            message: "Status changed successfully"
        });


    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "internal server error",
            error,
        });
    }
});


//get all products
router.post('/getSingleProduct', async (req, res) => {
    try {
        let values = await ProductModel.findOne({ _id: req.body.id });

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


//update products
router.put('/updateProduct/:id', async (req, res) => {
    try {
        let values = await ProductModel.findOne({ _id: req.params.id });

        if (values) {
            let doc = await ProductModel.updateOne(
                { _id: req.params.id },
                { $set: req.body.values },
            );

            res.status(201).send({
                message: "product updated successfully",
                doc
            });
        } else {
            res.status(400).send({
                message: "Invalid Id",
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

//delete product 
router.delete("/deleteProduct/:id", validate, roleAdmin, async (req, res) => {
    try {

        let product = await ProductModel.findOne({ _id: req.params.id });

        if (product) {
            let doc = await ProductModel.deleteOne({ _id: req.params.id });

            res.status(201).send({
                message: "Product Deleted successfully",
            });
        } else {
            res.status(400).send({
                message: "Invalid Id",
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

module.exports = router;