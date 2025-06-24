import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsPhoneNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  workNo: string;

  @IsString()
  @IsNotEmpty()
  cnName: string;

  @IsString()
  @IsOptional()
  enName?: string;

  @IsInt()
  @Min(0)
  @Max(120)
  @IsOptional()
  age?: number;

  @IsPhoneNumber('CN')
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsInt()
  @Min(0)
  @Max(2)
  @IsOptional()
  sex?: number;

  @IsInt()
  @Min(0)
  @Max(1)
  @IsOptional()
  status?: number;
}
