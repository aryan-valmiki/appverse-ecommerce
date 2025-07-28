import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const protect = async (req, _, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            throw new ApiError(404, "Unauthorized request");
        }

        const jwtPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const user = await User.findById(jwtPayload.id).select("-password");

        if (!user) {
            throw new ApiError(400, "Invalid Access Token")
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
}



const isAdmin = async (req, _, next) => {
    try {
        const user = req.user;

        if (!user) {
            throw new ApiError(400, "Unauthorized request")
        }

        if (!user.isAdmin) {
            throw new ApiError(403, "Access denied. Admins only.")
        }

        next()
    } catch (error) {
        throw new ApiError(401, error.message || "No Admin")
    }
}



export { protect, isAdmin }