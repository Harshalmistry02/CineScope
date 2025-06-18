import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
app.use(cors({
  origin: 'http://localhost:5173', // or your frontend origin
  credentials: true
}));


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.route.js'
import movieRouter from './routes/movie.route.js'
import reviewRouter from './routes/review.routes.js';
//routes declaration

app.use("/api/v1/users", userRouter)
//http://localhost:5000/api/v1/users/register

app.use("/api/v1/movies", movieRouter)
//http://localhost:5000/api/v1/movies/createMovie  

app.use("/api/v1/reviews", reviewRouter);
// http://localhost:5000/api/v1/reviews/create

export { app }