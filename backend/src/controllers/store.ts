import { Request, Response } from "express";
import db from "../database/db";
import { authenticateToken } from "../middleware/authenticateToken";

// Get All Stores
export const getStores = [authenticateToken(["user", "admin"]),
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


// Get stores with 
export const getStoresByUser = [
  authenticateToken(['user']),
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

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
          r.rating AS user_rating,
          r.id AS user_rating_id, 
          u.id AS owner_id,
          u.name AS owner_name,
          u.email AS owner_email
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id AND r.user_id = ?
        LEFT JOIN users u ON s.owner_id = u.id
        WHERE 1=1   
      `;

      const queryParams: any[] = [userId];

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

// Get stores with 
export const getSingleStore = [
  authenticateToken(['owner']),
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      const stores:any = await db.query(`SELECT * FROM stores WHERE owner_id = ? LIMIT 1`, userId);

      let store=stores[0]||null;

      res.status(200).json({
        message: "Stores retrieved successfully",
        data: store
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  },
];



// Get stores with 
export const getSingleStoreWithRatings = [
  authenticateToken(['owner']),
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      const {
        sortBy = "created_at",
        sortOrder = 'ASC'
      } = req.query as {
        sortBy?:string
        sortOrder?: string;
      };

      let query = `
        SELECT 
          r.id,
          r.rating,
          r.owner_id,
          r.created_at,
          u.id AS user_id, 
          u.name AS user_name,
          u.email AS user_email
        FROM ratings r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.owner_id = ?
      `;

      const queryParams: any[] = [userId];

      const validSortColumns = ['rating','created_at'];
      const validSortOrders = ['ASC', 'DESC'];

      const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
      const safeSortOrder = validSortOrders.includes(sortOrder.toUpperCase())
        ? sortOrder.toUpperCase()
        : 'ASC';

      query += ` ORDER BY r.${safeSortBy} ${safeSortOrder}`;

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


