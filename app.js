require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')
const connectDB = require('./db/connect')
const productRouter = require('./routes/products')


//middleware
app.use(express.json())


//Route
app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">Products routes</a>')
})

app.use('/api/v1/products', productRouter)

app.use(notFoundMiddleware);
app.use(errorMiddleware)


const port = process.env.PORT || 3005
const start = async() => {
    try {
        await connectDB(process.env.MONGODB_URL)
        app.listen(port, ()=> console.log(`Server started at http://localhost:${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()