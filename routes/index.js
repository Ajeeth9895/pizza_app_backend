var express = require('express');
var router = express.Router();
const { ProductModel } = require('../schema/productSchema');
const mongoose = require('mongoose');
const { dbUrl } = require('../config/dbConfig');
const { roleAdmin, validate } = require('../config/auth');


//connect to DB
mongoose.connect(dbUrl)


//Get product details
router.get('/product-details', async (req, res) => {
  try {
    let product = await ProductModel.find()

    res.status(200).send({
      product
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal server error",
      error,
    });
  }
})


//create product
router.post('/create-product', validate, roleAdmin, async (req, res) => {
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


module.exports = router;
