import express from "express";
import { getStores } from "../controllers/store";

const router=express.Router();

router.get('/getStores',getStores);

export default router;

