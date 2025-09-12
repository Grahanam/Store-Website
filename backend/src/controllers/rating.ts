import { Request, Response } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import db from "../database/db";

// Create Rating
export const createRating = [ async (req: Request, res: Response) => {
  try {
    const { storeId,rating } = req.body;
    const { userId } = req.params;

    if (!storeId) {
      return res.status(400).json({ message: 'StoreId is required' });
    }

    const user: any = await db.query(`SELECT * FROM users where id = ? LIMIT 1`, userId);
    if (user.length == 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const result: any = await db.query(`INSERT INTO ratings SET ?`, { store_id:storeId,user_id:userId,rating  });
    let message = 'Error in creating rating';
    if (result.affectedRows) {
      message = "Record created successfullly"
      return res.status(201).json({
        message
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
}];

//update Rating
export const updateRating=[
  async(req:Request,res:Response)=>{
    try{
      const {rating}=req.body;
      const {ratingId}=req.params;
      
      const existing:any=await db.query(`SELECT * FROM ratings WHERE id = ? LIMIT 1`,ratingId)
      if(existing.length===0){
        res.status(401).json({message:"Rating with this id does not exist"})
      }

      const result:any=await db.query(`UPDATE ratings SET rating = ? WHERE id = ?`,[rating,ratingId])

      let message = 'Error in updating rating';
      if(result.affectedRows){
        message="Rating updated successfully"
      }
      return res.status(200).json({message});
    }catch(error){
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error });
    }
  }
]

//Get All Ratings
export const getRatings = [async (req: Request, res: Response) => {
  try {
    const result:any = await db.query(`SELECT * FROM ratings`,[]);

    res.status(200).json({
      message: 'Store Ratings retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
}];

//Get Ratings of shopOwner by showowner userId
export const getStoreRatings = [async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user:any = await db.query(`SELECT * FROM users WHERE id = ? LIMIT 1`,userId);
    if (user.length==0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const result:any = await db.query(`SELECT * FROM ratings WHERE store_id = ?`,userId);


    res.status(200).json({
      message: 'Store Ratings retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
}];


//Get Ratings submitted by UserId
export const getUserRatings = [async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user:any = await db.query(`SELECT * FROM users WHERE id = ? LIMIT 1`,userId);
    if (user.length==0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const result:any = await db.query(`SELECT * FROM ratings WHERE user_id = ?`,userId);


    res.status(200).json({
      message: 'User Ratings retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
}];

