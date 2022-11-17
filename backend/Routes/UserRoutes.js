const UserController = require('../Controller/UserController');
const express = require('express');
const router = express.Router();
const auth = require('../MiddleWare/Auth');


//Register
router.post("/signup",UserController.register);

//Login
router.post("/login",UserController.login);

module.exports=router;
