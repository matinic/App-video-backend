import { Request, Response, NextFunction } from "express";
import { HttpError } from "@/lib/errors/http.error";

export default function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err instanceof HttpError ? err.status : 500;
  const message = err instanceof Error ? err.message : "Internal Server Error";
  // Log estructurado opcional (pino/winston)
  console.error(err);
  res.status(status).json({ success: false, message, ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}) });
}