import { User } from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendCookie } from "../utils/features.js"

export const getAllUsers = async (req, res) => {}

export const login = async (req, res, next) => {
	const { email, password } = req.body
	const user = await User.findOne({ email }).select("+password") //Select false karyu che etle aapde direct access na kari sakiye

	if (!user)
		return res.status(404).json({
			success: false,
			message: "Invalid Email or Password",
		})

	const isMatch = await bcrypt.compare(password, user.password)

	if (!isMatch)
		return res.status(404).json({
			success: false,
			message: "Invalid Email or Password",
		})

	sendCookie(user, res, `Welcome back, ${user.name}`, 200)
}

export const logout = async (req, res, next) => {
	res.status(404).cookie("token", "", { maxAge: 0 }).json({
		success: true,
		message: "Logged Out",
	})
}

export const register = async (req, res) => {
	const { name, email, password } = req.body
	let user = await User.findOne({ email })
	if (user)
		return res.status(404).json({
			success: false,
			message: "User already exist",
		})

	const hashedPassword = await bcrypt.hash(password, 10)

	user = await User.create({
		name: name,
		email: email,
		password: hashedPassword,
	})

	sendCookie(user, res, "Registered Successfully", 201)
}

export const getMyProfile = (req, res) => {
	res.status(200).json({
		success: true,
		user: req.user,
	})
}
