import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interface/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  logger = new Logger(JwtStrategy.name);
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<'string'>('JWT_SECRET')!,
    });
    this.logger.log('🚀 JWT Strategy Booted!');
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findOneById(payload.sub);

    if (!user) throw new UnauthorizedException('Invalid user.');
    if (user.isBlacklisted)
      throw new UnauthorizedException('Your account is suspended.');

    return user;
  }
}
