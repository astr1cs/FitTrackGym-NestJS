import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) 
{
  constructor() 
  {
    super({
      // Look for the token in the Authorization header as a "Bearer token"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'YOUR_SUPER_SECRET_KEY', // In production, use environment variables!
    });
  }

  // If the token is valid, Passport attaches this returned object to req.user
  async validate(payload: any) 
  {
    return { userId: payload.sub, email: payload.email };
  }
}