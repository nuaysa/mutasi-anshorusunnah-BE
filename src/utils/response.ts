import { Response } from "express";

export function successResponse<T>(
  res: Response,
  data: T,
  status = 200,
  message: string | null = null
) {
  return res.status(status).json({
    data,
    status,
    message,
  });
}

export function errorResponse(
  res: Response,
  {
    error = "Application Error",
    message,
    status = 500,
    errorCode,
    data,
  }: {
    error: string;
    message: string;
    status?: number;
    errorCode?: string;
    data?: object | object[];
  }
) {
  return res.status(status).json({
    error,
    message,
    status,
    errorCode,
    data,
  });
}
