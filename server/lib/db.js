import mongoose from "mongoose";

export const connectDB = async () => {
	try{
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`mongoDB connected: ${conn.connection.host}`);
	} catch(error) {
		console.log("Error connectng to mongoDB", error.message);
		process.exit(1);
	}
}