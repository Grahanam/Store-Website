import db from "../database/db";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from "uuid";

export const validateSignup = [
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

export const validateSignin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
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

// Signup
export const signup = async (req: Request, res: Response) => {
  try {
    if(handleValidationErrors(req, res)){
      return;
    }
    
    const { name, email, address, password } = req.body;

    const rows: any = await db.query(`Select * FROM users WHERE email = ? LIMIT 1`, [email]);

    if (rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userId = uuidv4();

    const result: any = await db.query(`INSERT INTO users SET ?`, { id:userId, name, email, address,password: hashedPassword });

    let message = 'Error in creating user';
    if (result.affectedRows) {
      const token = jwt.sign(
        { sub: userId,role:'user' },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
      );
      res.status(200).json({
        message: 'SignUp successful',
        token,
        user: {
          id: userId,
          name: name,
          email: email,
          role: 'user'
        },
      });
    }

    res.status(401).json({
      message,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error });
  }
};

// Signin
export const signin = async (req: Request, res: Response) => {
  try {
    if(handleValidationErrors(req, res)){
      return;
    }

    const { email, password } = req.body;

    const rows: any = await db.query(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email]);
    if (rows.length == 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid Password' });
    }

    const token = jwt.sign(
      { sub: user.id, role:user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Signin successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error });
  }
};
