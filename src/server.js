import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectClodinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectClodinary()

// Middlewares 
app.use(express.json())
app.use(cors())

// API endpoint
app.use('/api/user', userRouter)
app.use("/api/cart", cartRouter);
app.use("/api/product", productRouter);
app.get('/', (req, res) => {
    res.send('API is Working')
})

app.listen(port, ()=>console.log('Server is Running on port 4000'))
