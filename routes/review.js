const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js")
const {isLoggedIn, validateReview, isReviewAuthor} = require("../middleware.js");




//Reviews :
//POST :
router.post("/",isLoggedIn,validateReview,wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    // console.log(req.params.id,newReview);
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    // res.send("Review Saved");
    
    req.flash("success","Review Created !");
    res.redirect(`/listings/${req.params.id}`);
}));

//DELETE REVIEW ROUTE :
router.delete("/:reviewID",isLoggedIn,isReviewAuthor,
    wrapAsync(async (req,res)=>{
    let{id, reviewID} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);

    req.flash("success","Review Deleted !");
    res.redirect(`/Listings/${id}`);
})
);

module.exports = router;