import { AccountConfirmationEntity } from '../entities/account-confirmation.entity';

export abstract class AccountConfirmationRepository {
  abstract save(accountConfirmationEntity: AccountConfirmationEntity): Promise<AccountConfirmationEntity>;

  abstract findByActivationCode(code: string): Promise<AccountConfirmationEntity>;

  abstract findValidByUserId(userId: number): Promise<AccountConfirmationEntity | null>;

  abstract invalidateAllForUser(userId: number): Promise<void>;
}
