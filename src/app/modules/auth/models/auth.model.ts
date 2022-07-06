export class AuthModel {
  authToken: string;
  refreshToken: string;
  expiresIn: Date;
  verify: Boolean;
  completada: Boolean;

  setAuth(auth: AuthModel) {
    this.authToken = auth.authToken;
    this.refreshToken = auth.refreshToken;
    this.expiresIn = auth.expiresIn;
    this.verify = auth.verify
    this.completada = auth.completada
  }
}
