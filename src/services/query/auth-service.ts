import {UnauthorizedError} from '../../util/errors';
import {SessionQueryService} from './session-query-service';

export class AuthService {

  public static async loadUserForBearerTokenHeader(authHeader: string) {
    const session = await this.loadSession(authHeader);
    if (!session.user) {
      throw new UnauthorizedError('User not found from session: ' + session.id);
    } else {
      return session.user;
    }
  }

  private static async loadSession(token: string) {
    // const parts = authHeader.split(' ');
    // if (parts.length !== 2 || parts[0] !== 'Bearer') {
    //   throw new Error('Invalid Authorization header, expected \'Bearer <token>\'');
    // }
    // const token = parts[1];
    const session = await SessionQueryService.loadLoginSession(token);
    if (!session) {
      throw new UnauthorizedError('invalid token: ' + token);
    } else if (session.isExpired) {
      throw new UnauthorizedError('session.expired');
    }
    return session;
  }
}
