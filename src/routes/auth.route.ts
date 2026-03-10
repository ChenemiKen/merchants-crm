import { Router } from 'express';
import { validateRequest } from '../middleware/validation.middleware';
import { LoginSchema, SignupSchema } from '../models/schemas/auth.schema';
import { AuthController } from '@/controllers/auth.controller';
import { UserService } from '@/services/user.service';
import { UserRepository } from '@/db/repositories/user.repository';
import { Database } from '@/db/database';
import { RefreshTokenRepository } from '@/db/repositories/refresh_token.repository';
import { TokenService } from '@/services/token.service';

const router = Router();
const database = new Database();
const userRepository = new UserRepository(database);
const userService = new UserService(userRepository);
const tokenRepository = new RefreshTokenRepository(database);
const tokenService = new TokenService(tokenRepository);
const authController = new AuthController(userService, tokenService);


/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupSchema'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input or User already exists
 */
router.post('/signup', validateRequest(SignupSchema), authController.signup);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginSchema'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateRequest(LoginSchema), authController.login);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     responses:
 *       200:
 *         description: Token refreshed
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh', authController.refresh);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authController.logout)

export default router;
