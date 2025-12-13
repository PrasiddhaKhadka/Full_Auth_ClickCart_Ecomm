const express = require('express');
const router = express.Router();
const {authenticationMiddleware, authorizePermission} = require('../middlewares/authentication');

const {  
    getAllUsers, 
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    deleteUser 
} = require('../controllers/user-controller');

router.get('/', authenticationMiddleware, authorizePermission('admin','owner'), getAllUsers);
router.get('/showMe', authenticationMiddleware, showCurrentUser);
router.get('/:id', authenticationMiddleware, getSingleUser);

router.patch('/updateuser',authenticationMiddleware, updateUser);
router.patch('/updateuserpassword',authenticationMiddleware, updateUserPassword);

router.delete('/deleteuser', deleteUser);

module.exports = router;
