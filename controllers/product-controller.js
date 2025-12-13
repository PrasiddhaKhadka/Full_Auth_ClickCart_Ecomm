const Product = require('../models/Product');
const CustomAPIError = require('../errors/')
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const cloudinary = require('../cloudinaryConfig');
const fs = require('fs');


const getProducts = async(req,res)=>{
    const products = await Product.find({})
    res.status(StatusCodes.OK).json({status:"Success",products:products});
}

const getProductDetails= async(req,res)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        throw new CustomAPIError.NotFoundError('The product is not found or the id is invalid')
    }
    const product = await Product.findOne({_id:req.params.id}).populate('reviews');
    if(!product){
        throw new CustomAPIError.NotFoundError(`Product with ${req.params.id} not found!`);
    }
    res.status(StatusCodes.OK).json({status:"Success",product:product})
}

const createProduct = async(req,res)=>{
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(200).json({msg:'Success',product:product})
}


const updateProduct = async(req,res)=>{
    const { id: productId } = req.params;
    
    const product = await Product.findOneAndUpdate({_id:productId},req.body,{
        new:true,
        runValidators:true,
    });
    if(!product){
        throw new CustomAPIError.NotFoundError(`No product with id: ${productId}`)
    }

    res.status(StatusCodes.OK).json({status:"Success",body:product})

}

const deleteProduct = async(req,res)=>{
    const { id: productId} = req.params;
    const product = await Product.findOne({_id:productId});
    if(!product){
        throw new CustomAPIError.NotFoundError(`No product with id: ${productId}`)
    }
    await product.deleteOne()
    res.status(StatusCodes.OK).json({msg:"Success, Product removed."})
}

const uploadProductImage = async(req,res)=>{
    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename: true,
            folder: 'CLICKCART',
    
        });
        fs.unlinkSync(req.files.image.tempFilePath);
        return res.status(StatusCodes.OK).json({image:{src:result.secure_url}})
}

module.exports={
    getProducts,
    getProductDetails,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProduct,
    uploadProductImage
}