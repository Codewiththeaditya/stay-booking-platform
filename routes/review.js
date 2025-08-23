const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js")


const validateReview = (req, res, next) =>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


//Reviews :
//POST :
router.post("/",validateReview,wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    // console.log(req.params.id,newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    // res.send("Review Saved");
    
    req.flash("success","Review Created !");
    res.redirect(`/listings/${req.params.id}`);
}));

//DELETE REVIEW ROUTE :
router.delete("/:reviewID",
    wrapAsync(async (req,res)=>{
    let{id, reviewID} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);

    req.flash("success","Review Deleted !");
    res.redirect(`/Listings/${id}`);
})
);

module.exports = router;