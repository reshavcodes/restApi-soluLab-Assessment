const mongoose = require('mongoose');
require('dotenv').config()

const password=process.env.PASS
const username=process.env.USER

mongoose.connect(
    `mongodb+srv://${username}:${password}@cluster0.pbb45.mongodb.net/restapi?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  ).then(()=>{
    console.log("Connected to MongoDB for Product Schema");
  }
  ).catch((err)=>{
    console.log("Error in DB Connection");
  });



const categorySchema=new mongoose.Schema({

    categoryId:{
        type:Number,
        required:true,
    },
    categoryName:String,

})


const productSchema = new mongoose.Schema({
    productId:mongoose.Schema.Types.ObjectId,
    productName: {
        type: String,
        required: true
    },
    qtyPerUnit:{
        type: Number,
        required: true
    },
    unitInStock:{
        type: Number,
        required: true
    },
    discontinued:{
        type: Boolean,
        required: true
    },
    categoryId:{
        type:Number,
        range:[1,7],
        default:6
    },
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;