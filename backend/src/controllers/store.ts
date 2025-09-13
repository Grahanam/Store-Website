import { Request, Response } from "express";
import db from "../database/db";
import { authenticateToken } from "../middleware/authenticateToken";

// Get All Stores
export const getStores = [authenticateToken(["admin"]),
  async (req: Request, res: Response) => {
    try {
      const {
        name,
        email,
        address,
        sortBy = 'name',
        sortOrder = 'ASC'
      } = req.query as {
        name?: string;
        email?: string;
        address?: string;
        sortBy?: string;
        sortOrder?: string;
      };

      let query = `
        SELECT 
          s.id,
          s.name,
          s.email,
          s.address,
          s.average_rating,
          s.created_at,
          u.id AS owner_id,
          u.name AS owner_name,
          u.email AS owner_email
        FROM stores s
        LEFT JOIN users u ON s.owner_id = u.id
        WHERE 1=1
      `;

      const queryParams: any[] = [];

      if (name) {
        query += ' AND s.name LIKE ?';
        queryParams.push(`%${name}%`);
      }

      if (email) {
        query += ' AND s.email LIKE ?';
        queryParams.push(`%${email}%`);
      }

      if (address) {
        query += ' AND s.address LIKE ?';
        queryParams.push(`%${address}%`);
      }

      const validSortColumns = ['name', 'email', 'address', 'average_rating', 'created_at'];
      const validSortOrders = ['ASC', 'DESC'];
      
      const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'name';
      const safeSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) 
        ? sortOrder.toUpperCase() 
        : 'ASC';

      query += ` ORDER BY s.${safeSortBy} ${safeSortOrder}`;

      const stores = await db.query(query, queryParams);

      res.status(200).json({
        message: "Stores retrieved successfully",
        data: stores
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  },
];
