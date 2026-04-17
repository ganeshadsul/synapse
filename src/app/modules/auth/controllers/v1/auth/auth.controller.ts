import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ResponseMessage } from '../../../../../common/decorators/response-message.decorator';
import { LoginDto } from '../../../dto/login.dto';
import { UserService } from '../../../../user/user.service';
import { AuthService } from '../../../auth.service';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Login successful.')
  async login(@Body() logInDto: LoginDto): Promise<any> {
    const response = await this.authService.login(logInDto);
    return response;
  }
}
