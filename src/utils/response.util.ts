import { Response } from "express";

export const sendSuccess = (
    res: Response,
    statusCode = 200,
    data: any = null,
    message = "Success",
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const sendError = (
    res: Response,
    statusCode = 500,
    message = "Something went wrong",
    error: any = null
) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error,
    });
};