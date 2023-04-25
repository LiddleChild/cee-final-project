const express = require("express");
const router = express.Router();

const coursevilleController = require("./../controllers/coursevilleController");
const authUtil = require("../utils/authUtil");

router.get("/access_token", coursevilleController.accessToken);
router.get("/login", coursevilleController.login);
router.get("/logout", coursevilleController.logout);
router.get("/get_user_info", authUtil.requireLogin(coursevilleController.getUserInfo));

module.exports = router;
