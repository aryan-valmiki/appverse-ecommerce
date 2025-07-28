import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "email & password required");
    }

    const existedUser = await User.findOne({ email });

    if (!existedUser) {
        throw new ApiError(404, "No user found");
    }

    const isPasswordValid = await existedUser.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid Password");
    }

    const token = existedUser.generateAccessToken();

    const userWithoutPassword = await User.findById(existedUser._id).select("-password")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", token, options)
        .json({
            message: "Logged In Successfully",
            user: userWithoutPassword
        })
})


const register = asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        throw new ApiError(400, "email & password & name is required");
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(400, "User already exists");
    }

    const createdUser = await User.create({
        name,
        email,
        password
    });

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    const user = await User.findById(createdUser._id).select("-password");

    return res
        .status(201)
        .json(
            {
                message: "User created successfully",
                user
            }
        )
})


const logout = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(
            {
                message: "User logged out successfully"
            }
        )
})



export { login, register, logout }