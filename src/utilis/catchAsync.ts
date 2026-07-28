import type { NextFunction, Request, RequestHandler, Response } from "express";


const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      res.json({
        success: false,
        message: "Something went wrong",
        error: error
      })
    }
  };
};

export default catchAsync;