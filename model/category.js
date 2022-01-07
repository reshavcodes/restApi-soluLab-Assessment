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
    console.log("Connected to MongoDB for Category Schema");
  }
  ).catch((err)=>{
    console.log("Error in DB Connection");
  });



const categorySchema=new mongoose.Schema({

    categoryId:{
        type:Number,
        required:true,
    },
    categoryName:{
        type:String,
        required:true,
    },

})



const Category = mongoose.model('Category', categorySchema);

module.exports = Category;


