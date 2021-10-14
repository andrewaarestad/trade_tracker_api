import {AuthService} from '../services/query/auth-service';
import {Authenticator} from './authenticator';

export class XAuthTokenUserAuthenticator extends Authenticator {
  protected async authenticate() {
    const authHeader = this.req.header('X-Auth-Token');
    if (!authHeader) {
      throw new Error('Authorization header required.');
    }
    return AuthService.loadUserForBearerTokenHeader(authHeader);
  }
}
