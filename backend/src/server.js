import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"
import { connectDB } from "./lib/db.js";

const PORT=process.env.PORT;
const FRONTEND_URL=process.env.FRONTEND_URL;
const app = express();

const allowedOrigins = ["http://localhost:5173",FRONTEND_URL]
app.use(cors({
    origin : allowedOrigins,
    credentials:true //allow frontend to send cookies
}))
app.use(express.json());
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("Hello world");
})

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/chat",chatRoutes);
await connectDB();    
app.listen((PORT),()=>{
    console.log(`Server is running on port ${PORT}`);
})