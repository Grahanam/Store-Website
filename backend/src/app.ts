import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import cors from "cors";

import ratingRoutes from "./routes/rating";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user"
import storeRoutes from "./routes/store"

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
}));
app.use(express.json());

app.use('/api/auth',authRoutes)
app.use('/api/rating',ratingRoutes)
app.use('/api/user',userRoutes)
app.use('/api/store',storeRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


export default app;