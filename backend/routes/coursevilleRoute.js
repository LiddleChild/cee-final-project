const express = require("express");
const router = express.Router();

const coursevilleController = require("./../controllers/coursevilleController");

router.get("/access_token", coursevilleController.accessToken);
router.get("/login", coursevilleController.login);
router.get("/logout", coursevilleController.logout);

module.exports = router;
