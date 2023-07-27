import { FactoryProvider } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import { Environment } from '../../../environment';
export const MAIL_TRANSPORTER_TOKEN = Symbol.for('MAIL_TRANSPORTER_TOKEN');

export const MAIL_TRANSPORTER_PROVIDER: FactoryProvider<Transporter> = {
  provide: MAIL_TRANSPORTER_TOKEN,
  useFactory: (environment: Environment) => {
    return createTransport({
      host: environment.SMTP_HOST,
      port: environment.SMTP_PORT,
      auth: { user: environment.SMTP_USER, pass: environment.SMTP_PASSWORD },
      pool: true,
      maxConnections: 10,
      maxMessages: Infinity,
    });
  },
  inject: [Environment],
};
