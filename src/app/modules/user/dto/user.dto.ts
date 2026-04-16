import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  // Personal Info
  @IsString({ message: 'First name must be a valid string.' })
  @IsNotEmpty({ message: 'First name should not be empty.' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters.' })
  @MinLength(3, { message: 'First name must have atleast 3 characters.' })
  firstName!: string;

  @IsString({ message: 'Last name must be a valid string.' })
  @IsNotEmpty({ message: 'Last name should not be empty.' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters.' })
  @MinLength(3, { message: 'Last name must have atleast 3 characters.' })
  lastName!: string;

  @IsOptional()
  @IsPhoneNumber('IN', {
    message: 'Please enter a valid IN phone number.',
  })
  @IsNumber({}, { message: 'Phone must be a valid number.' })
  phone?: number | null;

  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email!: string;

  // Security
  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and special character.',
  })
  password!: string;

  // Relationships
  @IsOptional()
  @IsUUID('4', { message: 'Invalid genderId.' })
  genderId?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'User must have atleat one role assigned.' })
  @IsUUID('4', { message: 'Invalid roleId.' })
  roleIds!: string[];
}
