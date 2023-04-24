const express = require("express");
const router = express.Router();

const coursevilleController = require("./../controllers/coursevilleController");

router.get("/access_token", coursevilleController.accessToken);
router.get("/login", coursevilleController.login);
router.get("/logout", coursevilleController.logout);
router.get("/get_user_info", coursevilleController.getUserInfo);

module.exports = router;
