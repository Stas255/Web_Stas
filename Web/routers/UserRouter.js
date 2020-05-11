const express = require("express");
const userController = require('../controllers/UserController.js');
const userRouter = express.Router();

//userController.admin(false);


userRouter.get("/", userController.index);

module.exports = userRouter;