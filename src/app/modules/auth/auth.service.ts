import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials.');

    if (user.isBlacklisted)
      throw new UnauthorizedException('This account it suspended.');

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      throw new UnauthorizedException('Invalid credentials.');

    const payload = {
      id: user.id,
      email: user.email,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
