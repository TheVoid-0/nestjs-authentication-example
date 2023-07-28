import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../domain/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserTypeormRepository implements UserRepository {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  findByEmailOrMobilePhone(emailOrMobilePhone: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy([{ email: emailOrMobilePhone }, { mobilePhone: emailOrMobilePhone }]);
  }

  findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOneByOrFail({ id });
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return await this.userRepository.save(user);
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    await this.userRepository.update(userId, { password: newPassword });
  }
}
