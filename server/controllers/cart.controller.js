import Product from "../models/product.model.js"

export const addToCart = async (req, res) => {
	try{
		const {productId} = req.body;
		const user = req.user;

		const existingItem = user.cartItems.find(item => item.id === productId);
		if(existingItem) {
			existingItem.quamtity += 1;
		} else {
			user.cartItem.push(productId)
		}

		await user.save();
		res.json(user.cartItem);

	}catch(error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({message: "Server error", error: error.message});
	}
}


export const removeAllFromCart = async (req, res) => {
	try {
		const {productId} = req.body;
		const user = req.user;
		if(!productId) {
			user.cartItem = [];
		} else {
			user.cartItem = user.cartItem.filter(item => item.id !== productId)
		}

		await user.save();
		res.json(user.cartItems);

	} catch(error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({message: "Server error", error: error.message});
	}
}

export const updateQuantity = async (req, res) => {
	try{
		const {id: productId} = req.params;
		const {quantity} = req.body;
		const user = req.user;

		const existingItem = user.cartItems.find(item => item.id === productId);

		if(existingItem) {
			if(quantity === 0) {
				user.cartItems.filter(item => item.id !== productId);
				await user.save();
				return res.json(user.cartItems);
			}

			existingItem.quantity = quantity;
			await user.save();
			res.json(user.cartItems);
		} else {
			res.status(404).json({message: "Product not found"});
		}
	
	} catch(error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({message: "Server error", error: error.message});
	}
}



export const getCartProducts = async (req, res) => {
	try {
		const user = req.user;
		const products = await Product.find({_id: {$in: user.cartItems}});

		//add the quantity for each products
		const cartItems = products.map(product => {
			const item = user.cartItems.find(cartItem => cartItem.id === product.id) ;
			return {...product.toJSON(), quantity: item.quantity}
		})

		res.json(cartItems)

	} catch(error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({message: "Server error", error: error.message});
	}
}