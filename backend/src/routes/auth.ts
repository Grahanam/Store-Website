import express from "express";
import {signup,signin, validateSignin, validateSignup} from "../controllers/auth"


const router=express.Router();

router.post('/signup',validateSignup,signup);
router.post('/signin',validateSignin,signin);

export default router;

