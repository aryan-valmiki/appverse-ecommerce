import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const cartSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
})


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        cart: [cartSchema]
    },
    {
        timestamps: true,
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})


userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            name: this.name,
            id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.isPasswordCorrect = async function (password) {
    const response = await bcrypt.compare(password, this.password);
    return response;
}


export const User = mongoose.model("User", userSchema);