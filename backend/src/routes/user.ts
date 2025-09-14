import express from "express";
import { createUser, getUsers, updateUser } from "../controllers/user";
const router=express.Router()

router.post('/create',createUser)
router.get('/getUsers',getUsers)
router.put('/update',updateUser)

export default router;