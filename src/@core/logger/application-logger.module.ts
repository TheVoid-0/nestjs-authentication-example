import { Global, Logger, Module, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';

@Global()
@Module({
  providers: [
    {
      provide: Logger,
      useFactory(injectedBy: object) {
        return new Logger(injectedBy?.constructor?.name);
      },
      inject: [INQUIRER],
      scope: Scope.TRANSIENT,
    },
  ],
  exports: [Logger],
})
export class ApplicationLoggerModule {}
