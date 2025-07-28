import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user?._id;

    if (!productId || quantity < 1) {
        throw new ApiError(400, "Product id & quantity is required")
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "No user")
    }

    
    const existingItem = user.cart.find((item) => item.product == productId);
    console.log(existingItem)

    if (existingItem) {
        existingItem.quantity += quantity
    } else {
        user.cart.push({ product: productId, quantity })
    }

    await user.save();

    return res.status(200).json(
        {
            message: "Cart updated",
            cart: user.cart,
        }
    )
});


const removeFromCart = asyncHandler(async (req, res) => {
    const productId = req.params?.id;
    const userId = req.user?._id;

    if (!productId) throw new ApiError(400, "Product Id required");
    if (!userId) throw new ApiError(400, "Unauthorized request")

    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(404, "No user")
    }

    user.cart = user.cart.filter((item) => {
        return item._id.toString() !== productId
    })

    await user.save();

    return res.status(200).json(
        {
            message: "Item removed",
            cart: user.cart,
        }
    )
})


const updateQuantity = asyncHandler(async (req, res) => {
    const { quantity, productId } = req.body;
    const userId = req.user?._id;

    if (!productId) throw new ApiError(400, "Product Id required");
    if (quantity === 0) throw new ApiError(400, "Quantity cannot be zero");
    if (!userId) throw new ApiError(400, "Unauthorized request");

    const user = await User.findById(userId);

    if (!user) throw new ApiError(404, "User not found");

    user.cart = user.cart.map((item) => {
        if (item._id.toString() === productId) {
            item.quantity = quantity;
        }
        return item;
    })

    await user.save();

    return res.status(200).json(
        {
            message: "Item updated",
            cart: user.cart
        }
    )
})


const getCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) throw new ApiError(400, "Unauthorized request");

    const user = await User.findById(userId).populate("cart.product");

    if (user.cart.length === 0) {
        throw new ApiError(400, "No products in cart")
    }

    return res.status(200).json(
        {
            cart: user.cart
        }
    )
})

export { addToCart, removeFromCart, updateQuantity, getCart }