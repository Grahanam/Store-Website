import express from "express";
import { getSingleStore, getSingleStoreWithRatings, getStores, getStoresByUser } from "../controllers/store";

const router=express.Router();

router.get('/getStores',getStores);
router.get('/getStoresByUser',getStoresByUser);
router.get('/getSingleStore',getSingleStore);
router.get('/getStoreUserRatings',getSingleStoreWithRatings)

export default router;

