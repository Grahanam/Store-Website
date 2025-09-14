import { Request, Response } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import db from "../database/db";

// Create Rating
export const createRating = [authenticateToken(['user']), async (req: Request, res: Response) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user?.id;

    if (!storeId || !rating) {
      return res.status(400).json({ message: 'StoreId and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const existingRating: any = await db.query(
      `SELECT * FROM ratings WHERE store_id = ? AND user_id = ? LIMIT 1`, 
      [storeId, userId]
    );
    
    if (existingRating.length > 0) {
      return res.status(400).json({ message: 'You have already rated this store' });
    }

    const storeData: any = await db.query(
      `SELECT owner_id FROM stores WHERE id = ? LIMIT 1`, 
      [storeId]
    );
    
    if (storeData.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    const ownerId = storeData[0].owner_id;

    const result: any = await db.query(
      `INSERT INTO ratings (store_id, user_id, rating, owner_id) VALUES (?, ?, ?, ?)`, 
      [storeId, userId, rating, ownerId]
    );

    if (result.affectedRows) {
  
      await updateStoreAverageRating(storeId);
      
      return res.status(201).json({
        message: "Rating created successfully"
      });
    } else {
      return res.status(500).json({ message: 'Error creating rating' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
}];

// Update Rating
export const updateRating = [authenticateToken(['user']), async (req: Request, res: Response) => {
  try {
    
    const { storeId, rating } = req.body;
    const userId = req.user?.id;

    if (!storeId || !rating) {
      return res.status(400).json({ message: 'StoreId and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const existing: any = await db.query(
      `SELECT * FROM ratings WHERE store_id = ? AND user_id = ? LIMIT 1`, 
      [storeId, userId]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: "Rating not found" });
    }

    const result: any = await db.query(
      `UPDATE ratings SET rating = ? WHERE store_id = ? AND user_id = ?`, 
      [rating, storeId, userId]
    );

    if (result.affectedRows) {
    
      await updateStoreAverageRating(storeId);
      return res.status(201).json({ 
        message: "Rating updated successfully" 
      });
    } else {
      return res.status(500).json({ message: 'Error updating rating' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
}];

// Helper function to update store average rating
const updateStoreAverageRating = async (storeId: string) => {
  try {
    
    const avgResult: any = await db.query(
      `SELECT AVG(rating) as average FROM ratings WHERE store_id = ?`,
      [storeId]
    );
    
    const averageRating = avgResult[0].average || 0;
    
    await db.query(
      `UPDATE stores SET average_rating = ? WHERE id = ?`,
      [averageRating, storeId]
    );
  } catch (error) {
    console.error('Error updating store average rating:', error);
  }
};

//Get All Ratings
export const getRatings = [async (req: Request, res: Response) => {
  try {
    const result: any = await db.query(`SELECT * FROM ratings`, []);

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

    const user: any = await db.query(`SELECT * FROM users WHERE id = ? LIMIT 1`, userId);
    if (user.length == 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const result: any = await db.query(`SELECT * FROM ratings WHERE store_id = ?`, userId);


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

    const user: any = await db.query(`SELECT * FROM users WHERE id = ? LIMIT 1`, userId);
    if (user.length == 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const result: any = await db.query(`SELECT * FROM ratings WHERE user_id = ?`, userId);

    res.status(200).json({
      message: 'User Ratings retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
}];

