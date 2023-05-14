import express from "express"
import mongoose from "mongoose"
import userRouter from "./routes/user.js"
import taskRouter from "./routes/task.js"
import cookieParser from "cookie-parser"
import { config } from "dotenv"

export const app = express()

config({
	path: "./data/config.env",
})

//using Middleware
app.use(express.json())
app.use(cookieParser())

//Using Routes
app.use("/api/v1/users", userRouter)
app.use("/api/v1/task", taskRouter)

const schema = new mongoose.Schema({
	name: String,
	email: String,
	password: String,
})

app.get("/", (req, res) => {
	res.send("Heyyyy")
})
