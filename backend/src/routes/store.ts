import express from "express";
import { getStores, getStoresByUser } from "../controllers/store";

const router=express.Router();

router.get('/getStores',getStores);
router.get('/getStoresByUser',getStoresByUser);

export default router;

