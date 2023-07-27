import { Transporter } from 'nodemailer';
import NodeMailer, { Address } from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Inject } from '@nestjs/common';
import { Mail, MailAddress, MailClient } from '../mail-client';
import { MailResult } from '../../mail-result';
import { MAIL_TRANSPORTER_TOKEN } from '../mail-client.provider';

export class NodeMailerClient implements MailClient {
  constructor(@Inject(MAIL_TRANSPORTER_TOKEN) private readonly mailTransporter: Transporter<SMTPTransport.SentMessageInfo>) {}

  async send(mails: Mail[]): Promise<MailResult[]> {
    return Promise.all(mails.map(this.dispatch.bind(this)));
  }

  private async dispatch(mail: Mail): Promise<MailResult> {
    try {
      const result = await this.mailTransporter.sendMail(this.mailToMailOptions(mail));
      return MailResult.ok({ data: result });
    } catch (error: any) {
      return MailResult.fail(error);
    }
  }

  private mailToMailOptions(mail: Mail): NodeMailer.Options {
    return {
      from: this.resolveMailAddress(mail.from),
      to: mail.to.map(this.resolveMailAddress),
      encoding: 'UTF-8',
      html: mail.body,
      subject: mail.subject,
      replyTo: mail.replyTo ? this.resolveMailAddress(mail.replyTo) : undefined,
    };
  }

  private resolveMailAddress(mailAddress: MailAddress): Address | string {
    if (!mailAddress.name) {
      return mailAddress.email;
    }

    return { address: mailAddress.email, name: mailAddress.name };
  }
}
