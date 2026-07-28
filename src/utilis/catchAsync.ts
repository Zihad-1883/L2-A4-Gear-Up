import type { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      console.error("Error caught in catchAsync:", error);
      res.status(400).json({
        success: false,
        message: error?.message || "Something went wrong",
        errorDetails: error,
      });
    }
  };
};

export default catchAsync;
