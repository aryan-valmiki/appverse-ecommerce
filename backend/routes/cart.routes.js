import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { addToCart, getCart, removeFromCart, updateQuantity } from "../controllers/cart.controllers.js"

const router = express.Router()

router.route("/")
    .post(protect, addToCart)
    .get(protect, getCart)

router.route("/:id")
    .delete(protect, removeFromCart)

router.route("/")
    .patch(protect, updateQuantity)



export default router