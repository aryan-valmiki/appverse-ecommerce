import express from "express"
import { createOrder, getAllOrders, getMyOrder } from "../controllers/order.controllers.js";
import {isAdmin, protect} from "../middlewares/auth.middleware.js"

const router = express.Router()

router.route("/")
.post(protect, createOrder)
.get(protect, getMyOrder)

router.route("/admin")
.get(protect, isAdmin, getAllOrders)




export default router;