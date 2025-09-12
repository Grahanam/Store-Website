import db from "../database/db";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';



// Signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, address, password } = req.body;

    const rows: any = await db.query(`Select * FROM users WHERE email = ? LIMIT 1`, [email]);

    if (rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result: any = await db.query(`INSERT INTO users SET ?`, { name, email, address,password: hashedPassword });
    let message = 'Error in creating user';
    if (result.affectedRows) {
      const user = result[0];
      const token = jwt.sign(
        { sub: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
      );
      res.status(200).json({
        message: 'SignUp successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
      });
    }

    res.status(401).json({
      message,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Signin
export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const rows: any = await db.query(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email]);
    if (rows.length == 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = rows[0];

    console.log(user.password)

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid)
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
