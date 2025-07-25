import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import redis from "../lib/redis.js"

const generateTokens = (userId) => {
	const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

	return {accessToken, refreshToken}
}



const storeRefreshToken = async (userId, refreshToken) => {
	await redis.set(`refresh_token${userId}`, refreshToken, "EX",7*24*60*60);
}



const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true, //prevent XSS attack
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", //prevents CSRF attack
		maxAge: 15*60*1000,
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true, //prevent XSS attack
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", //prevents CSRF attack
		maxAge: 7*24*60*60*1000,
	});
}



export const signup = async (req, res) => {
	const {name, email, password} = req.body;
	try{
		const userExist = await User.findOne({email});
		if(userExist) return res.status(400).json({message: "User already exist"});

		const user = await User.create({name, email, password});

		// Authenticate user

		const {accessToken, refreshToken} = generateTokens(user._id);

		//store the refresh token to redis

		await storeRefreshToken(user._id, refreshToken);

		//set cookies
		setCookies(res, accessToken, refreshToken);

		res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			})
	} catch(error) {
		console.log("Error in signup controller", error.message)
		res.status(500).json({message: error.message})
	}
}



export const login = async (req, res) => {
	try{
		const {email, password} = req.body;
		const user = await User.findOne({email});
		
		if(user && (await user.comparePassword(password))) {
			const {accessToken, refreshToken} = generateTokens(user._id);
			await storeRefreshToken(user._id, refreshToken);
			setCookies(res, accessToken, refreshToken);
			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			})
		} else {
			res.status(401).json({message: "Invalid credentials"})
		}
	} catch(error) {
		console.log("Error in login controller", error.message)
		res.status(500).json({message: error.message})
	}
}


export const logout = async (req, res) => {
	try{
		const refreshToken = req.cookies.refreshToken;
		if(refreshToken) {
			const {userId} = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
			await redis.del(`refresh_token${userId}`)
		}
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.clearCookie("access-token")
	

		res.json({message: "Logged out successfully"});
	} catch(error) {
		console.log("Error in logout controller", error.message)
		res.status(500).json({message: "Server error", error: error.message })
	}
}


export const refreshToken = async (req, res) =>{
	try{
		
		const refreshToken = req.cookies.refreshToken;
		
		if(!refreshToken) {
			return res.status(401).json({message: "No refresh token provided"})
		}

		const {userId} = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
		console.log(userId)
		const storedToken = await redis.get(`refresh_token${userId}`);
		if(storedToken !== refreshToken) {
			return res.status(401).json({message: "Invalid refresh token"});
		}
		
		const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"})
		res.cookie("accessToken", accessToken, {
			httpOnly: true, //prevent XSS attack
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict", //prevents CSRF attack
			maxAge: 15*60*1000,
		});

		res.json({message: "Token refresh created"})

	}catch(error) {
		console.log("Error in refreshToken controller", error)
		res.status(500).json({message: "Server error", error: error.message })
	}
}


export const getProfile = async (req, res) => {
	try{
		res.json(req.user)
	} catch(error) {
		console.log("Error in getProfile controller", error)
		res.status(500).json({message: "Server error", error: error.message })
	}
}