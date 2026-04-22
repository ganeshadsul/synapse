import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { RoleService } from '../role/role.service';
import { GenderService } from '../gender/gender.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly genderService: GenderService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    this.logger.log(`loginDto: ${JSON.stringify(loginDto)}`);
    const { email, password } = loginDto;

    const user = await this.userService.findOneByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

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

  async signup(signupDto: SignupDto) {
    this.logger.log(`signupDto: ${JSON.stringify(signupDto)}`);
    const existingUser = await this.userService.findOneByEmailWithPassword(
      signupDto.email,
    );

    // Email already in use
    if (existingUser) {
      this.logger.log(`User already exits. `);
      throw new InternalServerErrorException('Email id already in use.');
    }

    const defaultRole = await this.roleService.getOneByCode('user');
    if (!defaultRole) {
      this.logger.log(`No default role found.`);
      throw new InternalServerErrorException('Something went wrong!');
    }

    const gender = await this.genderService.getActiveGenderByCode(
      signupDto.gender,
    );
    if (!gender) throw new BadRequestException('invalid gender.');

    const userData = {
      ...signupDto,
      gender: gender.id,
      roleIds: [defaultRole.id],
    };

    const user = await this.userService.create(userData);
    return {
      user,
    };
  }
}
