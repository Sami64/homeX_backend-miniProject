const express = require("express");
const router = express.Router();

const { login, signUp, getUserData } = require("../controllers/client");

router.post("/login", login);
router.post("/sign-up", signUp);
router.get("/profile", getUserData);

module.exports = router;
