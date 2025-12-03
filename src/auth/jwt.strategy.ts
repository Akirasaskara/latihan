import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usr: UserService) {
    const secret = process.env.JWT_SECRET;

    // Opsional: validasi saat startup, supaya tidak silent error
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret, // sekarang tipe-nya pasti string, bukan string | undefined
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    const user = await this.usr.findby(payload.id);

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan');
    }
    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }
}
