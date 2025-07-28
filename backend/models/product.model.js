import mongoose from "mongoose";


const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        image: {
            type: String, //take the url from cloudinary
            required: true
        },
        imagePublicId: {
            type: String,
            required: true
        },
        category: {
            type: String,
            default: "General"
        }
    },
    {
        timestamps: true
    }
)



export const Product = mongoose.model("Product", productSchema)