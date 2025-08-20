const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");             //ejs-mate package


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


app.use(express.urlencoded({extended:true}));  //form data parse
app.use(methodOverride("_method"));            //to change form method
app.use(express.static(path.join(__dirname,"public")));  //to use static files in public folder

app.set("view engine","ejs");     //to set view engine as ejs
app.set("views",path.join(__dirname,"views"));  //to set views folder for ejs temp or dynamic files
app.engine("ejs",ejsMate);

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";    //Our database URL

main().catch((err)=>{console.log(err)});  

async function main(){
    await mongoose.connect(MONGO_URL).then((res) => console.log("connected"));     //to Connect With dataBase

};



app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);




//root 
app.get("/",(req,res)=>{
    res.send("Hi i am root");
});

app.all(/.*/,(req,res,next) => {
    next(new ExpressError(404,"page not found"));
})

app.use((err, req, res, next) =>{
    let {statusCode = 500 , message = "Something went wrong !s"} = err;
    console.log(err);
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(port,()=>{
    console.log("Listening at port 8080.");
});

