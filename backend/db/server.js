import mongoose from "mongoose"


export const connectToDatabase = async () => {
    try {
        const response = await mongoose.connect(process.env.MONGODB_URI);
        return response;
    } catch (error) {
        throw error
    }
}
