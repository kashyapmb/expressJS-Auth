import { User } from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendCookie } from "../utils/features.js"
import ErrorHandler from "../middlewares/error.js"

export const getAllUsers = async (req, res) => {}

export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email }).select("+password") //Select false karyu che etle aapde direct access na kari sakiye

		if (!user) return next(new ErrorHandler("Invalid Email or Password", 400))

		const isMatch = await bcrypt.compare(password, user.password)

		if (!isMatch)
			return next(new ErrorHandler("Invalid Email or Password", 400))

		sendCookie(user, res, `Welcome back, ${user.name}`, 200)
	} catch (error) {
		next(error)
	}
}

export const logout = (req, res, next) => {
	res.status(404).cookie("token", "", { maxAge: 0 }).json({
		success: true,
		message: "Logged Out",
	})
}

export const register = async (req, res) => {
	try {
		const { name, email, password } = req.body
		let user = await User.findOne({ email })

		if (user) return next(new ErrorHandler("User already exist", 400))

		const hashedPassword = await bcrypt.hash(password, 10)

		user = await User.create({
			name: name,
			email: email,
			password: hashedPassword,
		})

		sendCookie(user, res, "Registered Successfully", 201)
	} catch (error) {
		next(error)
	}
}

export const getMyProfile = (req, res) => {
	res.status(200).json({
		success: true,
		user: req.user,
	})
}
