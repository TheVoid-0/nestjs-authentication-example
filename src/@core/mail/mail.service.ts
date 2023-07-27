import { Injectable } from '@nestjs/common';
import { Mail, MailClient } from './mail-client/mail-client';
import { isEmail } from 'class-validator';
import { MailResult } from './mail-result';

type TemplateContentReplacer = Array<{ from: string | RegExp; to: string }> | Record<string, string>;

interface MailAddress {
  name?: string;
  email: string;
}

export type SendMailOptions = {
  /**
   * E-mails destinatários
   */
  to: Array<MailAddress | string>;

  /**
   * Assunto
   */
  subject: string;

  /**
   * Remetente
   */
  from: MailAddress | string;

  /**
   * Template que será utilizado no body do e-mail
   */
  template: string;
  /**
   * Array ou Record de substituição de valores do template. A propriedade `from` será a string de busca no `.replace` enquanto a propriedade `to` será o valor substituído.
   * OBS: é possível passar um REGEXP para `from`
   * @example  const templateContent = { nome: 'Marco' }
   * @example  const templateContent = [ { from: '{{nome}}', to: 'Marco' }, { from: '{{nome}}', to: 'Marco Teste Max' } ]
   */
  templateContent?: TemplateContentReplacer | null;

  /**
   * Nome e e-mail que aparecerá ao selecionar para responder o e-mail, caso omitido será utilizado o `from.name` e `from.email` por padrão
   */
  replyTo?: MailAddress;
};

@Injectable()
export class MailService {
  constructor(private readonly mailClient: MailClient) {}

  async send(sendMailOptions: SendMailOptions): Promise<MailResult> {
    const mail = this.createMail(sendMailOptions);

    const [mailResult] = await this.mailClient.send([mail]);
    return mailResult;
  }

  async batchSend(sendMailOptions: SendMailOptions[]): Promise<MailResult[]> {
    const mails = sendMailOptions.map(sendMailOption => {
      return this.createMail(sendMailOption);
    });

    return this.mailClient.send(mails);
  }

  private createMail(sendMailOptions: SendMailOptions): Mail {
    const { to, subject, from, template, templateContent = null, replyTo } = sendMailOptions;

    const fromMailAddress: MailAddress = typeof from === 'string' ? { email: from } : { email: from?.email, name: from?.name };
    const toMailAddresses = to.map(this.resolveMailAddress);
    const body = templateContent ? this.replaceTemplateContent(template, templateContent) : template;

    return { body, to: toMailAddresses, subject, replyTo, from: fromMailAddress };
  }

  private resolveMailAddress(mailAddress: MailAddress | string): MailAddress {
    if (typeof mailAddress === 'string') {
      if (!isEmail(mailAddress)) {
        throw new Error(`Invalid e-mail address: ${mailAddress}`);
      }
      return { email: mailAddress };
    }

    if (!isEmail(mailAddress.email)) {
      throw new Error(`Invalid e-mail address: ${mailAddress.email}`);
    }

    return mailAddress;
  }

  private replaceTemplateContent(template: string, templateContent: TemplateContentReplacer) {
    if (!Array.isArray(templateContent)) {
      Object.entries(templateContent).forEach(([from, to]) => {
        template = template.replace(from, to);
      });

      return template;
    }
    templateContent.forEach(({ from, to }) => {
      template = template.replace(from, to);
    });

    return template;
  }
}
