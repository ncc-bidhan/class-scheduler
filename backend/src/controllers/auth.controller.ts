import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response";
import * as authService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authService.register(req.body);
    return sendSuccess(res, {
      title: "Registration successful",
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error: any) {
    return sendError(res, {
      title: "Registration failed",
      message: error.message,
      statusCode: 400,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    return sendSuccess(res, {
      title: "Login successful",
      message: "Logged in successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error: any) {
    return sendError(res, {
      title: "Login failed",
      message: error.message,
      statusCode: 401,
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(userId, currentPassword, newPassword);

    return sendSuccess(res, {
      title: "Success",
      message: "Password changed successfully",
      data: null,
    });
  } catch (error: any) {
    return sendError(res, {
      title: "Error",
      message: error.message,
      statusCode: error.message === "Incorrect current password" ? 400 : 500,
    });
  }
};
