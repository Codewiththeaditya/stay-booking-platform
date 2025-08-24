const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");






//listing route :
router.get("/",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));



//to create new using GET and POST route :
router
.get("/new",isLoggedIn,(req,res)=>{
    res.render("./listings/new.ejs");
});

router.post("",validateListing,
    wrapAsync(async (req,res) =>{
        if(!req.body.Listing){
            throw new ExpressError(400,"Send valid data for listing")
        }
        const newListing = new Listing(req.body.Listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success","New Listing Created !");
        res.redirect("/listings");
}));


//Update/edit Route using GET and PUT :

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing =await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist !");
        res.redirect("/listings");
    }else{
        res.render("./listings/edit.ejs",{listing});
    }
}));

router.put("/:id",isLoggedIn,isOwner,validateListing,
    wrapAsync(async (req,res)=>{
    let {id}=  req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    req.flash("success","Listing Updated !");
    res.redirect(`/listings/${id}`);
}));



//Delete route :

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res) => {
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    // console.log(deleted);
    req.flash("success","Listing Deleted !");
    res.redirect("/listings");
}));



//show route :
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("owner").populate({path: "reviews",populate: {path: "author"}});
    if(!listing){
        req.flash("error","Listing you requested for does not exist !");
        res.redirect("/listings");
    }else{
        // console.log(listing);
        res.render("./listings/show.ejs",{listing});
    }

}));


module.exports = router;