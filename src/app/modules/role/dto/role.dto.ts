import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { IsActiveStatus } from '../../../common/enums/is-active-status.enum';

export class CreateRoleDto {
  @IsString()
  @MinLength(3)
  name: string | undefined;

  @IsNumber()
  @Min(2)
  @Max(10)
  level: number | undefined;

  @IsString()
  @MinLength(20)
  @IsOptional()
  description: string | undefined;
}

export class PatchRoleDto extends PartialType(CreateRoleDto) {
  @IsEnum(IsActiveStatus, {
    message: 'isActive must be a valid status value',
  })
  @IsOptional()
  isActive?: number;
}

export class ReplaceRoleDto extends CreateRoleDto {
  @IsEnum(IsActiveStatus, {
    message: 'isActive must be a valid status value',
  })
  @IsOptional()
  isActive?: number;
}
