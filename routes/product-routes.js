const express = require('express');
const router = express.Router();
const {  getProducts,
    createProduct,
    getProductDetails,
    updateProduct,
    deleteProduct,
    uploadProductImage} = require('../controllers/product-controller');

const {authenticationMiddleware, authorizePermission} = require('../middlewares/authentication');

const { getSingleProductReview } = require('../controllers/review-controller')

router.post('/',[authenticationMiddleware,authorizePermission('admin','owner')],createProduct);
router.get('/',getProducts);
router.get('/:id',getProductDetails);
router.patch('/:id',[authenticationMiddleware,authorizePermission('admin')],updateProduct);
router.delete('/:id',[authenticationMiddleware,authorizePermission('admin')],deleteProduct);
router.post('/uploadImage',[authenticationMiddleware,authorizePermission('admin')], uploadProductImage)

router.get('/:id/reviews',getSingleProductReview)


module.exports = router