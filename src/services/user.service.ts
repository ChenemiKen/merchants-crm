import bcrypt from 'bcrypt';

// import { ERROR, SUCCESS } from '../../../constants/messages';
import { generateAccessToken } from '@/utils/token.util';
import { SignupDto, LoginDto } from '../domain/models/dto/auth.dto';
import { UserRepository } from '@/db/repositories/user.repository';
import { DuplicateModelException } from '@/constants/exceptions';

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
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const token = generateAccessToken(newUser.id!, newUser.email);
    return { newUser, token };
  }

  //   async heartbeat() {
  //     return unifiedResponse(true, 'Ok, From user');
  //   }

  //   async login(loginInputObj: LoginInputTypes) {
  //     const { email, password } = loginInputObj;
  //     const user = await this.userRepository.findUserByEmail(email);

  //     if (!user) {
  //       return unifiedResponse(false, ERROR.USER_NOT_FOUND);
  //     }

  //     const isPasswordValid = await bcrypt.compare(password, user.password || '');
  //     if (!isPasswordValid) {
  //       return unifiedResponse(false, 'Invalid credentials');
  //     }

  //     const token = generateToken(user.id, user.role?.name || 'user');
  //     return unifiedResponse(true, SUCCESS.LOGIN_SUCCESSFUL, { token });
  //   }

  //   async getProfile(userId: string) {
  //     const user = await this.userRepository.findUserById(userId);
  //     if (!user) {
  //       return unifiedResponse(false, ERROR.USER_NOT_FOUND);
  //     }
  //     return unifiedResponse(true, SUCCESS.USER_FOUND, user);
  //   }
}
