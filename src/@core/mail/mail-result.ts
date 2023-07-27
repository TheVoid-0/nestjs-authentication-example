export class MailResult {
  data: unknown;

  error: boolean | undefined | null | object;

  private isFailure: boolean;

  isError(): this is { error: object } {
    return this.isFailure;
  }

  toObject(): { data: unknown; error: boolean | undefined | null | object } {
    return {
      data: this.data,
      error: this.error,
    };
  }

  static fail(error: object): MailResult {
    const result = new MailResult();
    result.isFailure = true;
    result.error = error;
    return result;
  }

  static ok(params: { data: unknown; error?: boolean | null }): MailResult {
    const result = new MailResult();
    result.isFailure = false;
    result.data = params.data;
    result.error = params.error;
    return result;
  }
}
