import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "portfolio-jwt-secret-dev";
const JWT_EXPIRES_IN = "24h";

export type Role = "admin";

export interface JwtPayload {
  userId: number;
  role: Role;
}

/** Signs and returns a JWT for the given user/role. */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/** Verifies a JWT string and returns the decoded payload, or null on failure. */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

/** Express middleware – reads Bearer token from Authorization header. */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);

  if (!payload || payload.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Attach payload to request for downstream handlers if needed
  (req as any).jwtPayload = payload;
  next();
}
