import { Repository } from 'typeorm';
import { AccountConfirmationRepository } from '../domain/repositories/account-confirmation.repository';
import { AccountConfirmationEntity } from '../domain/entities/account-confirmation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AccountConfirmationTypeormRepository implements AccountConfirmationRepository {
  constructor(@InjectRepository(AccountConfirmationEntity) private readonly accountConfirmationRepository: Repository<AccountConfirmationEntity>) {}

  save(accountConfirmationEntity: AccountConfirmationEntity): Promise<AccountConfirmationEntity> {
    return this.accountConfirmationRepository.save(accountConfirmationEntity);
  }

  async findByActivationCode(code: string): Promise<AccountConfirmationEntity> {
    const accountConfirmation = await this.accountConfirmationRepository.findOne({ where: { isValid: true, code } });

    if (!accountConfirmation) {
      throw new NotFoundException('Account confirmation not found');
    }

    return accountConfirmation;
  }

  findValidByUserId(userId: number): Promise<AccountConfirmationEntity | null> {
    return this.accountConfirmationRepository.findOne({ where: { userId, isValid: true } });
  }

  async invalidateAllForUser(userId: number): Promise<void> {
    await this.accountConfirmationRepository.update({ userId, isValid: true }, { isValid: false });
  }
}
