import { Order } from "../models/order.models.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const user = await User.findById(userId).populate("cart.product");

    if (!user || user.cart.length === 0) {
        throw new ApiError(400, "Cart is empty")
    }

    const orderItems = user.cart.map((item) => {
        return {
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        }
    });
    console.log(orderItems)

    const itemsAmount = user.cart.reduce((acc, item) => {
        return acc + item.quantity * item.product.price;
    }, 0)

    console.log(itemsAmount)

    const order = await Order.create(
        {
            user: userId,
            orderItems,
            totalAmount: itemsAmount,
        }
    )

    if (!order) {
        throw new ApiError(500, "Server Error while creating order")
    }

    user.cart = [];
    await user.save();

    return res.status(201).json(
        {
            message: "Order Created",
            order
        }
    )
})


const getMyOrder = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const orders = await Order.find({ user: userId }).populate("orderItems.product", "title price quantity image").sort({ createdAt: -1 });

    if (orders.length === 0) {
        throw new ApiError(400, "No orders")
    }

    return res.status(200).json(
        {
            orders
        }
    )
})

//admin controller 
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().populate("user", "email isAdmin name cart").populate("orderItems.product", "title price image").sort({ createdAt: -1 });

    if (orders.length === 0) {
        throw new ApiError(404, "No orders")
    }

    return res.status(200).json(
        {
            orders,
        }
    )
})


export { createOrder, getMyOrder, getAllOrders }