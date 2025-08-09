const Book = require("../models/book");
const asyncHandler = require('express-async-handler');

// Create a new book
const createBook = asyncHandler(async (req, res) => {
    const { title, author, genre} = req.body;
    const book = new Book({
        title,
        author: req.user.id, // Assuming the author is the logged-in user
        genre
    });
    await book.save();
    res.status(201).json({
        message: "Book created successfully",
        book
    });
});
// Get all books
const getAllBooks = asyncHandler(async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

module.exports = {
    createBook,
    getAllBooks
};
