const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");


app.set("view engine","ejs");     //to set view engine as ejs
app.set("views",path.join(__dirname,"views"));  //to set views folder for ejs temp or dynamic files

const sessionOptions = 
    {
        secret: "mysupersecretstring",
        resave: false,
        saveUninitialized:true
    };


app.use(session(sessionOptions));
app.use(flash());


app.get("/register", (req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    req.flash("success","user registered successfully");
    res.redirect("/hello");
});

app.get("/hello", (req,res)=>{
    // console.log(req.flash("success"));
    res.locals.msg = req.flash("success");
    res.render("page.ejs",{name: req.session.name});
})


// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1
//     }
//     res.send(`you sent a request ${req.session.count} times`);
// });

// app.get("/test",(req,res)=>{
//     res.send("test successful !");
// });



app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
