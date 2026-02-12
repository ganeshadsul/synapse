import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsActiveStatus } from '../../../common/enums/is-active-status.enum';

export class CreateGenderDto {
  @IsString()
  @MinLength(3)
  name: string | undefined;

  @IsString()
  @MinLength(3)
  @IsOptional()
  code: string | undefined;

  @IsString()
  @MaxLength(5)
  shortName: string | undefined;
}

export class PatchGenderDto extends PartialType(CreateGenderDto) {
  @IsEnum(IsActiveStatus, {
    message: 'isActive must be a valid status value',
  })
  @IsOptional()
  isActive?: number;
}

export class ReplaceGenderDto extends CreateGenderDto {
  @IsEnum(IsActiveStatus, {
    message: 'isActive must be a valid status value',
  })
  isActive?: number;
}
