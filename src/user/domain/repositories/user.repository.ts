import { UserEntity } from '../entities/user.entity';

export abstract class UserRepository {
  abstract save(user: UserEntity): Promise<UserEntity>;

  abstract findByEmail(email: string): Promise<UserEntity | null>;

  abstract findById(id: number): Promise<UserEntity>;

  abstract updatePassword(userId: number, newPassword: string): Promise<void>;
}
