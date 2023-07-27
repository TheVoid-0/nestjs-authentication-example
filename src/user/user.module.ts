import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MailModule } from '../@core/mail/mail.module';
import { UserRepository } from './domain/repositories/user.repository';
import { UserTypeormRepository } from './repositories/user-typeorm.repository';
import { AccountConfirmationRepository } from './domain/repositories/account-confirmation.repository';
import { AccountConfirmationTypeormRepository } from './repositories/account-confirmation-typeorm.repository';
import { PasswordModule } from '../@core/password/password.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './domain/entities/user.entity';
import { AccountConfirmationEntity } from './domain/entities/account-confirmation.entity';

@Module({
  imports: [MailModule, PasswordModule, TypeOrmModule.forFeature([UserEntity, AccountConfirmationEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: UserRepository, useClass: UserTypeormRepository },
    { provide: AccountConfirmationRepository, useClass: AccountConfirmationTypeormRepository },
  ],
  exports: [UserService],
})
export class UserModule {}
