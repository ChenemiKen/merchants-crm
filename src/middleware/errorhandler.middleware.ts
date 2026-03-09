import { DuplicateModelException, InvalidStateException, NotFoundException, UnauthorizedException, ValidationException } from "@/constants/exceptions";
import { ErrorRequestHandler, Request, Response, NextFunction } from "express";

const environment = process.env.NODE_ENV || 'prod';

export interface AppError {
    success: true,
    message: "User created successfully",
    data: {
        id: 1,
        email: "test@mail.com"
    },
    error: null
}

export const errorHandler = (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction,
): Response | void => {
    if (environment === 'development') { console.log("Error💥:", err); }

    if (err instanceof SyntaxError &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any).status === 400 &&
        'body' in err
    ) {
        // Handle JSON syntax error
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON',
            error: 'Invalid JSON'
        });
    }

    if (err instanceof UnauthorizedException) {
        return res.status(401).json({
            success: false,
            message: err.message,
            error: err.message
        });
    }

    if (err instanceof ValidationException) {
        return res.status(400).json({
            success: false,
            message: err.message,
            error: err.error
        });
    }

    if (err instanceof InvalidStateException) {
        return res.status(400).json({
            success: false,
            message: "Unauthorized",
            error: err.message
        });
    }

    if (err instanceof NotFoundException) {
        return res.status(404).json({
            success: false,
            message: err.message,
            error: err.message
        });
    }

    if (err instanceof DuplicateModelException) {
        return res.status(400).json({
            success: false,
            message: err.message,
            error: err.message
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};


export const unknownEndpoint = (_request: Request, response: Response) => {
    response.status(404).send({ error: 'Not found' })
}