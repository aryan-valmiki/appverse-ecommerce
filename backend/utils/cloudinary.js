import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"

cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
)

const uploadToCloudinary = async (file) => {
    try {
        if (!file) {
            return "File is required"
        }
        const response = await cloudinary.uploader.upload(file, {
            resource_type: "auto"
        });
        fs.unlinkSync(file)
        console.log(response);
        return response;
    } catch (error) {
        fs.unlinkSync(file)
        throw error
    }
}


const deleteFromCloudinary = async (file) => {
    try {
        if (!file) {
            return "File is required"
        }
        const response = await cloudinary.uploader.destroy(file);
        console.log(response)
        return response.result === "ok";
    } catch (error) {
        throw error
    }
}



export { uploadToCloudinary, deleteFromCloudinary }