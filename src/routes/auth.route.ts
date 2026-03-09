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


router.post('/signup', validateRequest(SignupSchema), authController.signup);
router.post('/login', validateRequest(LoginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout)

export default router;
