const express = require('express');
const dontenv = require('dotenv').config();
const connectDB = require('./config/dbConnect.js');
const authRouter = require('./routes/auth.js');
const userRouter = require('./routes/user.js');
const bookRouter = require('./routes/book.js');
const {errorHandler} = require('./middleware/error.js');
const {verifyToken} = require('./middleware/auth.js');

//Connect to MongoDB
connectDB();

const app = express();

//Middleware
app.use(express.json());

//Routes
app.use('/api/auth', authRouter);
app.use('/api/user', verifyToken, userRouter);
app.use('/api/book', verifyToken, bookRouter);

app.use(errorHandler);
//Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



