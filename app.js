require('dotenv').config()

// EXPRESS
const express = require('express')
const app = express()
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')

// DATABASE
const connectDB = require('./db/connect')
// MIDDLEWARES
const notFound = require('./middlewares/not-found')
const errorHandler = require('./middlewares/error-hanlder')
// const authenticationMiddleware = require('./middlewares/authentication')

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors())
app.use(fileUpload({ useTempFiles: true }))

app.get('/',(req,res)=>{
    console.log(req.signedCookies);
    res.send('API WORKING!');
})

// ROUTERS
const authRouters = require('./routes/auth-routes')
app.use('/api/v1/auth',authRouters)

const userRouters = require('./routes/user-routes')
app.use('/api/v1/user',userRouters)

const productRouters = require('./routes/product-routes')
app.use('/api/v1/products',productRouters)

const reviewRouters = require('./routes/review-routes')
app.use('/api/v1/reviews',reviewRouters)

const orderRouters = require('./routes/order-routes')
app.use('/api/v1/orders', orderRouters)


// MIDDLEWARE
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8000
const startApp = async()=>{
    try {
        await connectDB(process.env.MONGODB_URL)
        app.listen(PORT,()=>{
            console.log('Server Running at 8000')
            })
        
    } catch (error) {
        console.log(error)
    }
}



startApp()

