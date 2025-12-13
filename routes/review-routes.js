const express = require('express')
const router = express.Router()
const { getReview,
    getReviews,
    postReview,
    updateReview,
    deleteReview } = require('../controllers/review-controller')

const  { authenticationMiddleware } = require('../middlewares/authentication')

router.post('/',authenticationMiddleware, postReview)
router.get('/',getReviews)
router.get('/:id',getReview)
router.patch('/:id',authenticationMiddleware, updateReview)
router.delete('/:id',authenticationMiddleware, deleteReview)

module.exports = router



