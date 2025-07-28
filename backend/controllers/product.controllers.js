import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";

//admin controller
const createProduct = asyncHandler(async (req, res) => {
    const { title, price, description, quantity, category } = req.body;
    console.log(req.file)
    const filePath = req.file?.path;

    if (!title || !description || !price || !quantity || !category) {
        throw new ApiError(400, "All fields are required")
    }

    if (!filePath) {
        throw new ApiError(400, "Product image is required")
    }

    const responseFromCloudinary = await uploadToCloudinary(filePath);

    if (!responseFromCloudinary.secure_url) {
        throw new ApiError(500, "Error while uploading in cloudinary")
    }

    const createdProduct = await Product.create({
        title,
        price,
        description,
        quantity,
        category,
        image: responseFromCloudinary.secure_url,
        imagePublicId: responseFromCloudinary.public_id
    });

    return res
        .status(201)
        .json(
            {
                message: "Product created successfully",
                product: createdProduct
            }
        )
});

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find();


    if (products.length === 0) {
        throw new ApiError(404, "No products found");
    }

    return res.status(200).json(
        {
            products
        }
    )
})

const getProductById = asyncHandler(async (req, res) => {
    const id = req.params?.id;

    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "No Product");
    }

    res.status(200).json(
        {
            product
        }
    )
})

const deleteProduct = asyncHandler(async (req, res) => {
    const id = req.params?.id;

    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "No product found")
    }

    const responseFromCloudinary = await deleteFromCloudinary(product.imagePublicId);

    if (!responseFromCloudinary) {
        throw new ApiError(500, "Error while deleting the file from cloudinary")
    }

    const deletedProduct = await Product.findByIdAndDelete(product._id);

    if (deletedProduct === null) {
        throw new ApiError(500, "Server Error")
    }

    return res.status(200).json(
        {
            message: "product delete successfully",
            product: deletedProduct
        }
    )

})



export { createProduct, getAllProducts, getProductById, deleteProduct }