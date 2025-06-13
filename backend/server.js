import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB database
connectDB();
// Connect to Cloudinary for media uploads
connectCloudinary();

// Middlewares
// Parse JSON request bodies
app.use(express.json());

// Configure CORS to allow multiple specific origins
// This is crucial for cross-origin requests from your frontends
const allowedOrigins = [
    'https://stylemaven.onrender.com',      // Your main frontend domain for showing products
    'https://stylemavenadmin.onrender.com'  // Your admin frontend domain for adding items
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g., from tools like Postman, curl, or same-origin requests)
        // Or if the request origin is found in the list of allowed origins
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true); // Allow the request
        } else {
            // Block the request if the origin is not in the allowed list
            console.error(`CORS blocked request from origin: ${origin}`); // Log blocked origin
            callback(new Error('Not allowed by CORS'), false); // Deny the request
        }
    },
    credentials: true // Allow sending cookies and authorization headers with cross-origin requests
}));

// API Endpoints
// Use imported routers for different API paths
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Root endpoint for checking API status
app.get('/', (req, res) => {
    res.send("API Working");
});

// Start the server and listen on the specified port
app.listen(port, () => console.log(`Server started on PORT: ${port}`));
