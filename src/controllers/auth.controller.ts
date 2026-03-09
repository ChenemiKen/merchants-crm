import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service';
import { SignupDto, LoginDto } from '@/domain/models/dto/auth.dto';
import { sendSuccess } from '@/utils/response.util';
import { generateRefreshToken, setRefreshCookie } from '@/utils/token.util';
import { UnauthorizedException } from '@/constants/exceptions';
import config from '@/config/config';
import { TokenService } from '@/services/token.service';


export class AuthController {
  private userService: UserService;
  private tokenService: TokenService;

  constructor(userService: UserService, tokenService: TokenService) {
    this.userService = userService;
    this.tokenService = tokenService;
  }

  signup = async (req: Request<{}, {}, SignupDto>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signupDto: SignupDto = req.body;
      const result = await this.userService.signup(signupDto);

      const refreshToken = generateRefreshToken(result.newUser.id!);
      await this.tokenService.create(result.newUser.id!, refreshToken);

      const response = {
        user: {
          id: result.newUser.id,
          email: result.newUser.email,
          name: result.newUser.name,
        },
        accessToken: result.token,
      };
      setRefreshCookie(res, refreshToken);
      sendSuccess(res, 201, response);
    } catch (error) {
      next(error);
    }
  };

  //   heartbeat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //     try {
  //       const result = await this.userService.heartbeat();
  //       res.status(result.success ? 200 : 400).json(result);
  //     } catch (error) {
  //       next(error);
  //     }
  //   };


  login = async (
    req: Request<{}, {}, LoginInputTypes>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const loginInputObj: LoginInputTypes = req.body; // Map request body to Obj
      const result = await this.userService.login(loginInputObj);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) throw new UnauthorizedException('No refresh token');
      let decoded;
      try {
        decoded = jwt.verify(refreshToken, config.JWT_SECRET!);
      } catch (err) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const doc = await this.tokenService.find(refreshToken);
      if (!doc) {
        throw new UnauthorizedException('Refresh token not recognized');
      }

      if (doc.revokedAt) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      if (doc.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token has expired');
      }

      const { newAccessToken, newRefreshToken } = await this.tokenService.rotateToken(doc, doc.user);
      setRefreshCookie(res, newRefreshToken);
      sendSuccess(res, 201, { accessToken: newAccessToken });
    } catch (error) {
      next(error);
    }
  };


  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.refresh_token;
      if (token) await this.tokenService.logout(token);
      res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
      sendSuccess(res, 200);
    } catch (error) {
      next(error);
    }
  }


  // getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     const userId = req.userId; // Assuming middleware adds `userId` to `req`
  //     //TODO: add better logic for userId check
  //     if (userId) {
  //       const result = await this.userService.getProfile(userId);
  //       res.status(result.success ? 200 : 404).json(result);
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}
