import express from "express";
import authRoutes from './routes/authRoutes'
import transactionRoutes from './routes/transactionRoutes'
import userRoutes from './routes/usersRoutes'

const cors = require("cors")
const morgan = require('morgan')
const {GlobalErrorHandler} = require('./controllers/errorController.ts')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express();

app.use(morgan())
app.use(cors({
  origin: ['*']
}))
app.use(cookieParser())
app.use(express.json())

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/transactions', transactionRoutes)
app.use('/api/v1/users', userRoutes)

const PORT = process.env.PORT || '3000'

app.listen(3000, () =>
  console.log(`Listening on port ${PORT}...`),
);

app.use(GlobalErrorHandler)