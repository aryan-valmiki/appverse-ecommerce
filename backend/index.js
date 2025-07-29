import dotenv from "dotenv";
import express from "express"
import { connectToDatabase } from "./db/server.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import { errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: "https://appverse-ecommerce-frontend.onrender.com", 
  credentials: true               
}));

//connect to database
connectToDatabase()
    .then((res) => {
        console.log("the connection is : ", res.connection.host)
        app.listen(port || 5000, () => {
            console.log(`the port is running on ${port}`)
        })
    })
    .catch((err) => {
        console.log(`Mongo connection error ${err}`)
    })



//import routes
import authRoutes from "./routes/auth.routes.js"
import productRoutes from "./routes/product.routes.js"
import orderRoutes from "./routes/order.routes.js"
import cartRoutes from "./routes/cart.routes.js"


app.use("/api/auth", authRoutes)
app.use("/api/product", productRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/cart", cartRoutes)



//middleware for error handling
app.use(errorHandler)
