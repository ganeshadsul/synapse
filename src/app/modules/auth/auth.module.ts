import { Global, Module } from '@nestjs/common';
import { AuthController as V1AuthController } from './controllers/v1/auth/auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RoleModule } from '../role/role.module';
import { GenderModule } from '../gender/gender.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PermissionCacheService } from './permission-cache-service/permission-cache.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../role/entities/role.entity';
import { RolePermissionMapping } from '../role/entities/role-permission-mapping.entity';
import { Permission } from '../role/entities/permission.entity';

@Module({
  imports: [
    UserModule,
    RoleModule,
    GenderModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRY', '6h') as '6h',
        },
      }),
    }),
    TypeOrmModule.forFeature([Role, Permission, RolePermissionMapping]),
  ],
  controllers: [V1AuthController],
  providers: [AuthService, JwtStrategy, PermissionCacheService],
})
export class AuthModule {}
