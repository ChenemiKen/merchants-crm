import { Router } from 'express';
import { validateRequest } from '../middleware/validation.middleware';
import { LoginSchema, SignupSchema } from '../domain/models/schemas/auth.schema';
import { UserController } from '@/controllers/auth.controller';
import { UserService } from '@/services/user.service';
import { UserRepository } from '@/db/repositories/user.repository';
import { Database } from '@/db/database';

const router = Router();
const database = new Database();
const userRepository = new UserRepository(database);
const userService = new UserService(userRepository);
const userController = new UserController(userService);


router.post('/signup', validateRequest(SignupSchema), userController.signup);

router.post('/login', validateRequest(LoginSchema), (req, res) => {
    res.send('Login');
});

export default router;
