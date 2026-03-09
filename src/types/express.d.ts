declare global {
    namespace Express {
        interface Request {
            user?: Record<string, any>; // You can replace this with your actual User or JwtPayload type
        }
    }
}

export { };
