import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name is required"],
	},
	email: {
		type: String,
		required: [true, "email is required"],
		unique: [true, "email must be unique"],
		lowercase: true,
		trim: true,
	},
	password: {
		type: String,
		required: [true, "password required"],
		minlength: [6, "password must be at least 6 characters long"],
	},
	cartItems: [
		{
			quantity: {
				type: Number,
				default: 1,
			},
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "product",
			}
		}
	],
	role: {
		type: String,
		enum: ["customer", "admin"],
		default: "customer",
	}

}, {
	timestamps: true
}
)

// Pre-save hook to hash password befor saving to database
userSchema.pre("save", async function (next) {
	if(!this.isModified("password")) return next();

	try{
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch(error) {
		next(error);
	}
})

userSchema.methods.comparePassword = async function(password) {
	return bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);



export default User;