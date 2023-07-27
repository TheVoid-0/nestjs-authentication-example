import { IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minLowercase: 0,
    minUppercase: 0,
  })
  password: string;

  @IsString()
  confirmationCode: string;
}
