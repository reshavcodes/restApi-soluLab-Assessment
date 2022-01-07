const express = require("express");
require("dotenv").config();

const router = express.Router();
// Product and Category Database Schema
const Product = require("../model/products");
const Category = require("../model/category");


//Category JSON to determine the category name and id
const categoryJson = {
  1: "electronics",
  2: "fashion",
  3: "home",
  4: "sports",
  5: "books",
  6: "others",
};


//Function to get the category id from the category name
const getProductId = (name) => {
  for (let i = 0; i < 7; i++) {
    if (categoryJson[i] === name) {
      return i;
    }
  }

  return -1;
};



//Main Routes

//Create ----------------------------------------------

router.post("/create", (req, res) => {

//Get the category id from the body of the request
  const categoryData = {
    categoryId: req.body.categoryId,
    //Getting the category name from the category id
    categoryName: categoryJson[req.body.categoryId],
  };


  //Creating a new product on the database
  Product.create(req.body).then((response) =>
    //If the product is created successfully
    //Make a category with that product
    Category.create(categoryData).then((CategoryResponse) => {
        //If the category is created successfully
      res
        .status(200)
        .send({ success: true, responseStatus: 200, data: response,message:"Product Created Successfully" });
    })
  ).catch((err) => {
    res.status(400).send({
        message: "Product Creation Failed",
        success: false,
        status: 400,
        data: null,
        error: err,
    });
})
});






//Read --------------------------------------------------

router.get("/readall", (req, res) => {

//Checking if the request has the category query
  if (req.query.category) {
    const categoryName = req.query.category;

    const catId = getProductId(categoryName);


    //If the category id is not among the categories
    if (catId === -1) {
      res.status(400).send({
        message: "Invalid category",
        success: false,
        categoryData: categoryJson,
        status: 200,
        data: null,
      });
    }

    //If the category id is among the categories
    Product.find({ categoryId: catId }).then((response) => {
      res.send(response);
    }).catch((err) => {
        res.status(400).send({
            message: "Error in fetching products",
            success: false,
            status: 400,
            data: null,
            error: err,
        });
    });
  } 
  
  //If the query doesn't have the category query
  else {
    Product.find({}).then((response) => {
      res.send(response);
    }).catch((err) => {
        res.status(400).send({
            message: "Error in fetching products",
            success: false,
            status: 400,
            data: null,
            error: err,
        });
    });
  }
});

router.get("/read/:id", (req, res) => {
  const id = req.params.id;
  Product.findById(id)
    .then((response) => {
      res.send(response);
    }).catch(err=>{
        res.status(400).send({
            message: "Error in fetching product with the given id",
            success: false,
            status: 400,
            data: null,
            error: err,
        });
    })
});






//Update ------------------------------------------------

router.put("/update/:id", (req, res) => {
  const id = req.params.id;
  Product.findByIdAndUpdate(id, req.body)
    .then(() => {

        //Fetching the updated product of that id
        Product.findById(id).then(response=>{
            res.status(200).send({
                message: "Product updated successfully",
                success: true,
                status: 200,
                data: response,
        
              });
        })
      
    })
    .catch((err) => {
        res.status(400).send({
            message: "Error in updating product with the given id",
            success: false,
            status: 400,
            data: null,
            error: err,
        });
    })
});






//Delete ------------------------------------------------

router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  //Getting the api key from the header
  const apikey = req.headers.apikey;

    //If the api key is not valid
  if (apikey !== process.env.KEY) {
    res.send({
      error: "Invalid Api Key",
      message: "Please provide valid api key",
    });
  } 

  //If the api key is valid
  else {
    Product.findByIdAndDelete(id)
      .then((response) => {
          //If the product is deleted successfully
          //Delete the category of that product
        Category.findOneAndDelete({ categoryId: response.categoryId });
        //After deleting the category from database
        res.send({
          message: "Product deleted successfully",
          status: 200,
          data: response,
        });
      })
      .catch((err) => {
        res.send({
          error: err,
          message: "Error in finding the product of that id",
        });
      });
  }
});




//Error Handling of the routes
router.get("/:error",(req,res)=>{
    res.status(400).send({
        error: `Invalid Api Path, No path with ${req.params.error} exists`,
        status: 400,
        message: {
            "/products/readall": "To get all products",

            "/products/readall?category=<category_name>": [
            "To get all products of that category", 
            "List of all categories: [electronics, fashion, home, sports, books, others]"
            ],


            "/products/read/<product_id>": "To get a product by id",


            "/products/create": "To create a product",


            "/products/delete?apikey=xyz": "To delete a product with api key",


            "/products/update/<product_id>": "To update a product with the product id",

        },

    });
})



module.exports = router;
