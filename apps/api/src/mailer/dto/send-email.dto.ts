import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SendEmailDto {
  @IsString()
  user_id: string;

  @IsString()
  profile_id: string;

  @IsEmail()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  html: string;

  @IsString()
  @IsOptional()
  landing_id?: string | null;

  @IsString()
  @IsOptional()
  tracking_token?: string | null;
}
