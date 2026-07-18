import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: string;   // admin user id
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'fittrack_jwt_secret', // move to .env in production
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token');
    }
    // whatever is returned here gets attached to req.user
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}