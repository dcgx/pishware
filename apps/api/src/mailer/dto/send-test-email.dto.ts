import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class SendTestEmailDto {
    @IsInt()
    profileId: number;

    @IsEmail()
    to: string;

    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsString()
    @IsNotEmpty()
    html: string;
}
