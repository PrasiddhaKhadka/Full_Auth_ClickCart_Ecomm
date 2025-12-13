const Order = require('../models/Order')
const Product = require('../models/Product')
const CustomAPIError = require('../errors/')
const checkPermission = require('../utils/check-permission')
const { StatusCodes } = require('http-status-codes')



// FAKE STRIPE API 
const fakeStripeApi = async({amount, curreny})=>{
    const client_secret='someRandomValue';
    return {client_secret,amount,curreny}
}


const getOrders = async(req,res)=>{
    const orders = await Order.find({})
    res.status(StatusCodes.OK).json({
        msg:'Success',
        orders:orders,
        count:orders.length,
    })
}

const getOrderDetails = async(req,res)=>{
    const { id: orderId } = req.params;
    const orders = await Order.findById({
        _id:orderId
    })
    if(!orders){
        throw new CustomAPIError.NotFoundError(`No order with id : ${orderId}`)
    }
    checkPermission(req.user, orders.user)
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
}

const getCurrentUserOrders = async(req,res)=>{
    const orders = await Order.find({user: req.user.userId});
    res.status(StatusCodes.OK).json({
        msg:'Success',
        orders:orders,
        count:orders.length,
    })
}

const postOrder = async(req,res)=>{
    const { items: cartItems, tax, shippingFee } = req.body;

    if(!cartItems || cartItems.length < 1 ){
        throw new CustomAPIError.BadRequestError(
            "No cart items provided"
        );
    }
    
    if(!tax || !shippingFee){
        throw new CustomAPIError.BadRequestError(
            "Please, Provide Tax and Shipping Fee"
        );
    }

    let orderItems = [];
    let subTotal = 0; 

    for (const item of cartItems){
       
        const dbProduct = await Product.findById({
            _id:item.product
        })
       
        if(!dbProduct){
            throw new CustomAPIError.NotFoundError(
                `The product is not found ${item.product}`
            )
        }
        // console.log(dbProduct)
        const {name, image, price, _id} = dbProduct;
        const singleOrderItem={
            amount:item.amount,
            name,
            price,
            image,
            product:_id
        }

        // orderItems.push(singleOrderItem)
        // 
        orderItems = [...orderItems, singleOrderItem]

        // Calculating the subtotal
        subTotal += item.amount * price;

    }

    // CALCULATING THE TOTAL PRICE
    const total = shippingFee + tax + subTotal;

    // GETTING THE CLIENT SECRET (FAKE FUNCTION TO DEPICT THE STRIPE!)
    const paymentIntent = await fakeStripeApi({
        amount:total,
        curreny:'usd'
    })

    const order = await Order.create({
        orderItems: orderItems,
        total: total,
        subtotal: subTotal,
        shippingFee: shippingFee,
        tax: tax,
        clientSecret:paymentIntent.client_secret,
        user:req.user.userId
    })

    res.status(StatusCodes.CREATED).json({
       msg:"Success",
       order,
       client_secret:order.client_secret
    })
}


const updateOrder = async(req,res)=>{
    const { id: orderId} = req.params;
    const order = await Order.findById({_id:orderId})
    const { paymentIntentId } = req.body;
    if(!order){
        throw new CustomAPIError.NotFoundError(`No order with id:${order}`)
    }
    checkPermission(req.user,order.user);
    
    order.paymentIntentId = paymentIntentId;

    order.status = 'paid';

    await order.save();

    res.status(StatusCodes.OK).json({
        msg:'Success',
        order:order
    })
}

const deleteOrder = async(req,res)=>{
    res.status(StatusCodes.OK).json({
        msg:'Delete Order'
    })
}

module.exports ={
    getOrders,
    getOrderDetails,
    getCurrentUserOrders,
    postOrder,
    updateOrder,
    deleteOrder
}