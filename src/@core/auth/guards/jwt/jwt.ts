export interface JWT {
  iss: string;

  aud: string;

  iat: number;

  exp: number;

  data: string;

  nbf: number;
}
