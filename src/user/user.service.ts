import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { UserRepository } from './domain/repositories/user.repository';
import { UserEntity } from './domain/entities/user.entity';
import { PasswordService } from '../@core/password/password.service';
import { MailService } from '../@core/mail/mail.service';
import { randomBytes } from 'crypto';
import { AccountConfirmationEntity } from './domain/entities/account-confirmation.entity';
import { MINUTE } from '../@core/constants';
import { AccountConfirmationRepository } from './domain/repositories/account-confirmation.repository';
import { Environment } from '../environment';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accountConfirmationRepository: AccountConfirmationRepository,
    private readonly passwordService: PasswordService,
    private readonly mailService: MailService,
    private readonly environment: Environment,
    private readonly logger: Logger,
  ) { }

  async create(user: UserEntity) {
    const existingUserEmail = await this.userRepository.findByEmailOrMobilePhone(user.email);

    if (existingUserEmail) {
      throw new BadRequestException('User email already in use');
    }

    const existingUserMobile = await this.userRepository.findByEmailOrMobilePhone(user.mobilePhone);

    if (existingUserMobile) {
      throw new BadRequestException('User mobile phone already in use');
    }

    user.password = await this.passwordService.hashPassword(user.password);

    const savedUser = await this.userRepository.save(user);

    await this.sendUserConfirmationEmail(savedUser);

    return { id: savedUser.id };
  }

  async confirmAccount(code: string) {
    const accountConfirmation = await this.accountConfirmationRepository.findByActivationCode(code);

    if (accountConfirmation.isExpired()) {
      throw new BadRequestException('Confirmation code has expired');
    }

    accountConfirmation.isValid = false;

    const user = await this.userRepository.findById(accountConfirmation.userId);

    user.isActive = true;

    await this.userRepository.save(user);
    await this.accountConfirmationRepository.save(accountConfirmation);
  }

  async resetPassword(password: string, confirmationCode: string): Promise<void> {
    const accountConfirmation = await this.accountConfirmationRepository.findByActivationCode(confirmationCode);
    if (accountConfirmation.isExpired()) {
      throw new BadRequestException('Confirmation code has expired');
    }

    const newPassword = await this.passwordService.hashPassword(password);

    await this.userRepository.updatePassword(accountConfirmation.userId, newPassword);
  }

  findById(id: number): Promise<UserEntity> {
    return this.userRepository.findById(id);
  }

  findByEmailOrMobilePhone(emailOrMobilePhone: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmailOrMobilePhone(emailOrMobilePhone);
  }

  async sendUserConfirmationEmail(user: UserEntity) {
    const confirmationCode = await this.getConfirmationCodeForUser(user);

    const result = await this.mailService.send({
      from: this.environment.SMTP_USER,
      subject: 'Account confirmation',
      to: [user.email],
      template: `
          <h1>Account confirmation</h1>
          <p>Hi ${user.name}, please confirm your account by clicking on the link below:</p>
          <a href="${this.environment.API_URL}/users/confirm-account?code=${confirmationCode}">Confirm account</a>
          
          or use the code below: 
          <h3>${confirmationCode}</h3>
          `,
    });

    if (result.isError()) {
      this.logger.error(result.error);
      throw new InternalServerErrorException('Could not send confirmation email, please ask for a new one');
    }
  }

  async getConfirmationCodeForUser(user: UserEntity): Promise<string> {
    await this.accountConfirmationRepository.invalidateAllForUser(user.id);

    const accountConfirmation = new AccountConfirmationEntity();
    accountConfirmation.userId = user.id;
    accountConfirmation.expiresAt = new Date(Date.now() + 5 * MINUTE);

    const confirmationCode = await this.generateConfirmationCode(accountConfirmation);

    return confirmationCode;
  }

  private async generateConfirmationCode(accountConfirmation: AccountConfirmationEntity, depth = 0): Promise<string> {
    if (depth > 5) {
      throw new InternalServerErrorException('Could not generate confirmation code');
    }

    const confirmationCode = randomBytes(3).toString('hex').toUpperCase();

    accountConfirmation.code = confirmationCode;

    try {
      await this.accountConfirmationRepository.save(accountConfirmation);
    } catch (error) {
      this.logger.error(error);
      return this.generateConfirmationCode(accountConfirmation, depth + 1);
    }

    return confirmationCode;
  }
}
