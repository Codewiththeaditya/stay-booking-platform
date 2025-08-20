const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    Listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image:Joi.allow("",null),
        price: Joi.number().required().min(0),
        country: Joi.string().required(),
        location: Joi.string().required()
    }).required()
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.required(),
    }).required()
});