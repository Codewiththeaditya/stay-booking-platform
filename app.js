const express = require("express");
const app = express();
const port = process.env.PORT || 8080 ;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");             //ejs-mate package
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user.js");
require("dotenv").config();


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")


app.use(express.urlencoded({extended:true}));  //form data parse
app.use(methodOverride("_method"));            //to change form method
app.use(express.static(path.join(__dirname,"public")));  //to use static files in public folder
app.use(cookieParser());

app.set("view engine","ejs");     //to set view engine as ejs
app.set("views",path.join(__dirname,"views"));  //to set views folder for ejs temp or dynamic files
app.engine("ejs",ejsMate);

const MONGO_URL = process.env.Mongo_URL ;//|| "mongodb://127.0.0.1:27017/wanderlust";    //Our database URL

main().catch((err)=>{console.log(err)});  

async function main(){
    await mongoose.connect("mongodb+srv://Therealaditya:sonata%40mongodb@cluster0.atjx2p5.mongodb.net/wanderlust?retryWrites=true&w=majority&appName=Cluster0").then((res) => console.log("connected"));     //to Connect With dataBase
};

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  //ms in 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

//root 
app.get("/",(req,res)=>{
    res.send("Hi i am root");
});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get('/demouser',async (req,res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-user"
//     });

//     let registeredUser = await User.register(fakeUser,"helloWorld");
//     res.send(registeredUser);
// })


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);






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

