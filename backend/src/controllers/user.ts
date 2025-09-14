import { Request, Response } from "express";
import db from "../database/db";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from "uuid";
import { authenticateToken } from "../middleware/authenticateToken";
import { body, validationResult } from 'express-validator';

export const validateCreateUser = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('Password must contain at least one uppercase letter and one special character')
];

const handleValidationErrors = (req: Request, res: Response): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const allErrorMessages = errors.array().map(error => error.msg).join(', ');

    res.status(400).json({
      message: allErrorMessages,
      errors: errors.array()
    });
    return true;
  }
  return false;
};

// Create User
export const createUser = [authenticateToken(['admin']),
async (req: Request, res: Response) => {
  try {
    if (handleValidationErrors(req, res)) {
      return;
    }

    const {
      name,
      email,
      address,
      password,
      role,
      storeName,
      storeEmail,
      storeAddress,
    } = req.body;

    const existingUser: any = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userId = uuidv4();

    const result: any = await db.query(
      `INSERT INTO users (id, name, email, address, password, role) 
         VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, name, email, address, hashedPassword, role]
    );

    if (!result.affectedRows) {
      return res.status(500).json({ message: "Error in creating user" });
    }

    if (role === "owner") {
      const ownerId = result.insertId;
      await db.query(
        `INSERT INTO stores (id, name, email, address, owner_id) 
           VALUES (UUID(), ?, ?, ?, ?)`,
        [storeName, storeEmail, storeAddress, userId]
      );
    }

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
},
];

// Upate User
export const updateUser = [authenticateToken(['admin', 'user', 'owner']),
async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const userId = req.user?.id;

    const existingUser: any = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    if (existingUser.length == 0) {
      return res.status(400).json({ message: "User does not exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result: any = await db.query(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, userId]);

    if (!result.affectedRows) {
      return res.status(500).json({ message: "Error in creating user" });
    }

    return res.status(201).json({
      message: "User updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
},
];

// Get All Users with queries
export const getUsers = [authenticateToken(['admin']),
async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      address,
      role,
      sortBy = 'name',
      sortOrder = 'ASC'
    } = req.query as {
      name?: string;
      email?: string;
      address?: string;
      role?: string;
      sortBy?: string;
      sortOrder?: string;
    };

    let query = `
        SELECT 
          u.id,
          u.name,
          u.email,
          u.address,
          u.role,
          u.created_at,
          COALESCE(s.average_rating, 0) AS store_rating
        FROM users u
        LEFT JOIN stores s ON u.id = s.owner_id
        WHERE 1=1
      `;

    const queryParams: any[] = [];


    if (name) {
      query += ' AND u.name LIKE ?';
      queryParams.push(`%${name}%`);
    }

    if (email) {
      query += ' AND u.email LIKE ?';
      queryParams.push(`%${email}%`);
    }

    if (address) {
      query += ' AND u.address LIKE ?';
      queryParams.push(`%${address}%`);
    }

    if (role) {
      query += ' AND u.role = ?';
      queryParams.push(role);
    }

    const validSortColumns = ['name', 'email', 'address', 'role', 'store_rating', 'created_at'];
    const validSortOrders = ['ASC', 'DESC'];

    const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'name';
    const safeSortOrder = validSortOrders.includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : 'ASC';

    query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;


    const users = await db.query(query, queryParams);


    const formattedUsers = (users as any[]).map(user => {

      if (user.role !== 'owner') {
        const { store_rating, ...userWithoutRating } = user;
        return userWithoutRating;
      }
      return user;
    });

    res.status(200).json({
      message: "User(s) retrieved successfully",
      data: formattedUsers
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
},
];
