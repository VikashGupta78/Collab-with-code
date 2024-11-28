// config/db.js

const mongoose = require("mongoose");

const mongo_url = "mongodb://0.0.0.0:27017/coded";

mongoose.connect(mongo_url) 
    .then(()=>{
        console.log("mongoDb successfully connected");
    })
    .catch((err)=>{
        console.log("mongo connection failed: ", err);
    });  

 