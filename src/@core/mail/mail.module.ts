import { Module } from '@nestjs/common';
import { MAIL_TRANSPORTER_PROVIDER } from './mail-client/mail-client.provider';
import { MailClient } from './mail-client/mail-client';
import { NodeMailerClient } from './mail-client/impl/nodemailer-client';
import { MailService } from './mail.service';

@Module({
  providers: [MAIL_TRANSPORTER_PROVIDER, { provide: MailClient, useClass: NodeMailerClient }, MailService],
  exports: [MailService],
})
export class MailModule {}
