const express = require('express')
const router = express.Router()
const { getOrders,
    getOrderDetails,
    getCurrentUserOrders,
    postOrder,
    updateOrder,
    deleteOrder } = require('../controllers/order-controller')

const { authenticationMiddleware , authorizePermission } = require('../middlewares/authentication')


router.get('/',authenticationMiddleware,authorizePermission('admin'),getOrders)

// SHOWING USER ORDER 
router.get('/showmyorders',authenticationMiddleware,getCurrentUserOrders)

router.get('/:id',authenticationMiddleware,getOrderDetails)
router.post('/',authenticationMiddleware,postOrder)
router.patch('/:id',authenticationMiddleware,updateOrder)
router.delete('/:id',deleteOrder)



module.exports = router