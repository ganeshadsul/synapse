import { Module } from '@nestjs/common';
import { AuthController as V1AuthController } from './controllers/v1/auth/auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [V1AuthController],
  providers: [AuthService],
})
export class AuthModule {}
