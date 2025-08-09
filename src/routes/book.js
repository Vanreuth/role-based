const express = require('express');
const router = express.Router();
const { createBook,getAllBooks } = require("../controller/book.js");

router.post("/", createBook);
router.get("/", getAllBooks);

module.exports = router;