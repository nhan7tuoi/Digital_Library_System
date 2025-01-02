import { NextFunction, Request, Response } from "express";
import { Errors } from "../../helper/error";
import { verifyAccessToken, verifyRefreshToken } from "./auth.utils";
import { Inject, Service } from "typedi";
import { RedisService } from "../../redis/redis.service";

@Service()
export class AuthMiddleware {
  constructor(@Inject() private redisService: RedisService) {}
  authenticateAccessToken(role: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers["authorization"];

        const token = authHeader && authHeader.split(" ")[1];

        
        if (!token) throw Errors.unAuthorized;
        const decoded = verifyAccessToken(token) as {
          id: string;
          role: string;
        };

        if (!decoded) {
          throw Errors.forbidden;
        }

        const storedAccessToken = await this.redisService.getValueFromhSet(
          `accessToken_${decoded.id}`,
          token
        );

        if (storedAccessToken !== token || !role.includes(decoded.role)) {
          throw Errors.forbidden;
        }
        req.body.userId = decoded.id;
        next();
      } catch (error) {
        next(error);
      }
    };
  }
  authenticateRefreshToken(role: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) throw Errors.unAuthorized;
        const decoded = verifyRefreshToken(token) as {
          id: string;
          role: string;
        };

        if (!decoded) {
          throw Errors.forbidden;
        }

        const storedRefreshToken = await this.redisService.getValueFromhSet(
          `refreshToken_${decoded.id}`,
          token
        );

        if (storedRefreshToken !== token || !role.includes(decoded.role)) {
          throw Errors.forbidden;
        }
        req.body.userId = decoded.id;
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
