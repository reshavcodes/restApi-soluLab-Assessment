const express = require('express');
const routes = require('./routes/api');



const app=express();


app.use(express.json());


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });



//Route
app.use('/products',routes);



app.listen(process.env.PORT || 5000,()=>{
    console.log('server is running on port 5000');
})



