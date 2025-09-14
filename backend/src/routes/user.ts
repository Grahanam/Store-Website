import express from "express";
import { createUser, getUsers, updateUser, validateCreateUser } from "../controllers/user";
const router=express.Router()

router.post('/create',validateCreateUser,createUser)
router.get('/getUsers',getUsers)
router.put('/update',updateUser)

export default router;