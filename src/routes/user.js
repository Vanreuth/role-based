const express = require('express');
const router = express.Router();
const { getUser,getAllUsers } = require("../controller/user");

router.get("/:id", getUser);
router.get("/", getAllUsers);

module.exports = router;