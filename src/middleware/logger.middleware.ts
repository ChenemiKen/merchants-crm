import pinoHttp from "pino-http";
import logger from "@/utils/logger.util";

export const httpLogger = pinoHttp({
    logger
});