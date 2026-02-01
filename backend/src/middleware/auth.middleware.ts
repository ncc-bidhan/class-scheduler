import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/response";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return sendError(res, {
      title: "Not Authorized",
      message: "Not authorized to access this route",
      statusCode: 401,
    });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return sendError(res, {
      title: "Not Authorized",
      message: "Not authorized to access this route",
      statusCode: 401,
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role)) {
      return sendError(res, {
        title: "Forbidden",
        message: `User role ${(req as any).user.role} is not authorized to access this route`,
        statusCode: 403,
      });
    }
    next();
  };
};
