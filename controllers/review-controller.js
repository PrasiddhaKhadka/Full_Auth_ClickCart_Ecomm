const Review = require('../models/Review');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('../errors');
const { checkPermission } = require('../utils');



const getReviews = async(req,res)=>{
    const reviews = await Review.find({}).populate({
        path:'product',
        select:'name'
    })
    .populate({
        path:'user',
        select:'name'
    });
    res.status(StatusCodes.OK).json({
        msg:'Success',
        body:reviews,
        count:reviews.length})
}

const getReview = async(req,res)=>{
    const {id} = req.params;
    const review = await Review.findOne({_id:id})
    if(!review){
        throw new CustomAPIError.NotFoundError('No review with give id found!')
    }
    res.status(200).json({msg:'Success',
        body:review
    })
}


const postReview = async(req,res)=>{
    const { product: productId} = req.body;
    const productExist = await Product.findById(productId)
    if(!productExist){
        throw new CustomAPIError.NotFoundError(`The product with ${productId} not found`)
    }

    const reviewExist = await Review.findOne({
        product:productId,
        user:req.user.userId,
    })
    if(reviewExist){
        throw new CustomAPIError.NotFoundError('Already submitted review for this product')
    }

    req.body.user = req.user.userId;
    const review = await Review.create(req.body)
    res.status(StatusCodes.CREATED).json({
        msg:'Success',
        body:review
    })
}

const updateReview = async(req,res)=>{
    const {id: reviewId} = req.params;
    const { rating, title, comment } = req.body;
    
    const review = await Review.findOne({ _id: reviewId });

    if(!review){
        throw new CustomAPIError.NotFoundError(`Review with this ${reviewId} not found`)
    }

    checkPermission(req.user, review.user)
    review.rating= rating
    review.title=title
    review.comment=comment

    await review.save()
    res.status(StatusCodes.OK).json({ msg:'Success',review });
}


const deleteReview = async(req,res)=>{
    const {id} = req.params;
    const review = await Review.findOne({_id:id})
    if(!review){
         throw new CustomAPIError.NotFoundError('The review for this prodcut has already been deleted')
    }
    checkPermission(req.user, review.user)
    await review.deleteOne();
    res.status(StatusCodes.OK).json({ msg: 'Success! Review removed' });
}



const getSingleProductReview = async(req,res)=>{
    const { id: productId} = req.params;
    const reviews = await Review.find({product:productId})
    res.status(StatusCodes.OK).json({reviews,count:reviews.length})
}


module.exports={
    getReview,
    getReviews,
    postReview,
    updateReview,
    deleteReview,
    getSingleProductReview
}