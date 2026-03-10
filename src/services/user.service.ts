import bcrypt from 'bcrypt';

import { generateAccessToken } from '@/utils/token.util';
import { UserRepository } from '@/db/repositories/user.repository';
import { DuplicateModelException, NotFoundException, UnauthorizedException } from '@/constants/exceptions';
import { LoginDto, SignupDto } from '@/models/schemas/auth.schema';

export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async signup(signupData: SignupDto) {
    const { email, password, name } = signupData;

    const existingUser = await this.userRepository.existsByEmail(email);
    if (existingUser) {
      throw new DuplicateModelException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    const token = generateAccessToken(newUser.id!, newUser.email);
    return { newUser, token };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException("Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = generateAccessToken(user.id!, user.email);
    return { user, token };
  }
}
