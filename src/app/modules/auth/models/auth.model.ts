export class AuthModel {
  authToken: string;
  refreshToken: string;
  expiresIn: Date;
  verify: Boolean;

  setAuth(auth: AuthModel) {
    this.authToken = auth.authToken;
    this.refreshToken = auth.refreshToken;
    this.expiresIn = auth.expiresIn;
    this.verify = auth.verify
  }
}
