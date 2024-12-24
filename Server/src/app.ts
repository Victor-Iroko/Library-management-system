import express from 'express';
import "express-async-errors" // saves you the trouble of writing try-catch blocks
import dotenv from 'dotenv';
import { notFound } from './middlewares/not-found';
import { errorHandler } from './middlewares/error-handler';
import cookieParser from 'cookie-parser'    
import cors from 'cors'
import { corsOption } from './config/corsOption';
import authRouter from 'routes/auth';
import cron from 'node-cron';
import { checkFines, checkOverdueBorrowings, reservationsAvailable } from 'utils/email-cron-notifications';
import { addFine } from 'utils/fine-cron';
import userRouter from 'routes/user';
import booksRouter from 'routes/books';
import borrowRouter from 'routes/borrow';
dotenv.config()



// instantiate express app
const app = express();

// every 5 days
cron.schedule('0 0 */5 * *', addFine) // at mid-night
cron.schedule('0 1 */5 * *', checkOverdueBorrowings);  // at 1am
cron.schedule('0 2 */5 * *', checkFines);            // at 2am
cron.schedule('0 4 */5 * *', reservationsAvailable); // at 4am


// middleware
app.use(cors(corsOption))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
// app.use(express.static("src\public"))

// routes
// supposed to be 'api/v1/auth' instead of just 'auth'
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/books', booksRouter)
app.use('/borrow', borrowRouter)


// not found
app.use(notFound)
// error handler middleware
app.use(errorHandler)

// start server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server is listening on port ${port}`))


