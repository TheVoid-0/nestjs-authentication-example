import { Injectable } from '@nestjs/common';
import { MailResult } from '../mail-result';

export interface MailAddress {
  name?: string;
  email: string;
}

export interface Mail {
  to: MailAddress[];

  subject: string;

  from: MailAddress;

  body: string;

  replyTo?: MailAddress;
}

@Injectable()
export abstract class MailClient {
  abstract send(mail: Mail[]): Promise<MailResult[]>;
}
