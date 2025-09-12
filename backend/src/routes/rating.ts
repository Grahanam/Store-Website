import express from "express";
import {getUserRatings,getStoreRatings,createRating,updateRating, getRatings} from "../controllers/rating";

const router=express.Router();

router.get('/getRatings',getRatings);
router.get('/getUserRatings/:userId',getUserRatings);
router.get('/getStoreRatings/:userId',getStoreRatings);
router.post('/create/:userId',createRating);
router.put('/update/:ratingId',updateRating);

export default router;

