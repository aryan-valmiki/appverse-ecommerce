import mongoose, { Schema } from "mongoose";


const orderItemsSchema = new mongoose.Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }
)

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        orderItems: [orderItemsSchema],
        totalAmount: {
            type: Number,
            required: true
        },
        orderStatus: {
            type: String,
            enum: ["Processing", "Shipped", "Delivered"],
            default: "Processing"
        }
    },
    {
        timestamps: true
    }
)




export const Order = mongoose.model("Order", orderSchema)