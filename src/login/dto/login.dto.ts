import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  emailOrMobilePhone: string;

  @IsString()
  password: string;
}
