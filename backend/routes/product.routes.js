import express from "express"
import { createProduct, deleteProduct, getAllProducts, getProductById } from "../controllers/product.controllers.js";
import { isAdmin, protect } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/")
    .get(getAllProducts)
    .post(protect, isAdmin, upload.single("image"), createProduct)

router.route("/:id")
    .get(getProductById)
    .delete(protect, isAdmin, deleteProduct)


export default router