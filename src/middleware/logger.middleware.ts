import pinoHttp, { startTime } from "pino-http";
import logger from "@/utils/logger.util";
import { green, yellow, red, blue } from "colorette";
import { Request, Response } from "express";

export function colorStatus(status: number) {
    if (status >= 500) return red(status.toString());
    if (status >= 400) return yellow(status.toString());
    if (status >= 200) return green(status.toString());
    return status.toString();
}

export function colorMethod(method: string) {
    switch (method.toUpperCase()) {
        case "GET": return blue(method);
        case "POST": return green(method);
        case "PUT": return yellow(method);
        case "DELETE": return red(method);
        default: return method;
    }
}

export const httpLogger = pinoHttp({
    logger,

    serializers: {
        req: () => undefined,
        res: () => undefined
    },

    customSuccessMessage(req: Request, res: Response, responseTime: number) {
        const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
        const status = colorStatus(res.statusCode);
        const method = colorMethod(req.method);

        return `[${time}] ${method} ${req.originalUrl} ${status} ${responseTime}ms`;
    },

    customErrorMessage(req: Request, res: Response, error: Error) {
        const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
        const status = colorStatus(res.statusCode);
        const method = colorMethod(req.method);
        const responseTime = Date.now() - (res as any)[startTime];

        return `[${time}] ${method} ${req.originalUrl} ${status} ${responseTime}ms`;
    }
});