import { IsEmail, IsString, IsStrongPassword, IsNotEmpty } from 'class-validator';
import { UserEntity } from '../domain/entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  mobilePhone: string;

  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minLowercase: 0,
    minUppercase: 0,
  })
  password: string;

  toDomain(): UserEntity {
    const userEntity = new UserEntity();
    userEntity.name = this.name;
    userEntity.email = this.email;
    userEntity.mobilePhone = this.mobilePhone;
    userEntity.password = this.password;

    return userEntity;
  }
}
