// server/src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

dotenv.config(); // Carrega variáveis do .env

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in .env");
  }
  return secret;
}

export function authenticateToken(req: CustomRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  jwt.verify(token, getJwtSecret(), (err, user) => {
    if (err) {
      console.error("JWT verification failed:", err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = user;
    next();
  });
}
