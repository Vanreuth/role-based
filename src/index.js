const express = require('express');
const dontenv = require('dotenv').config();
const connectDB = require('./config/dbConnect.js');
const authRouter = require('./routes/auth.js');
const userRouter = require('./routes/user.js');
const roleRouter = require('./routes/role.js');
const permissionRouter = require('./routes/permisson.js');
const categoryRouter = require('./routes/category.js');
const productRouter = require('./routes/product.js');
const orderRouter = require('./routes/order.js');
const cartRouter = require('./routes/cart.js')
const {errorHandler} = require('./middleware/errorhandler.js');
const {cacheMiddleware,cacheInterceptor,client} = require('./middleware/cache.js')
//Connect to MongoDB
connectDB();

const app = express();

// client.connect();

//Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

//Routes
app.use('/api/auth', authRouter);
//cache
app.use(cacheMiddleware);
app.use(cacheInterceptor(30*60)); // Cache for 30 minutes

app.use('/api/user', userRouter);
app.use('/api/role', roleRouter);
app.use('/api/permission', permissionRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);
app.use('/api/cart', cartRouter);

app.use(errorHandler);
//Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



