import {Session} from '../../models/domain/persisted/session';
import {SessionTypes} from '../../models/enums/session-types';
import {NotFoundError} from '../../util/errors';

export class SessionQueryService {


  public static async getSessionForPasswordReset(token: string) {
    const session = await Session.findOne({
      where: {token},
      relations: ['user']
    });
    if (!session) {
      throw new NotFoundError('Invalid reset token: ' + token);
    }
    return session;
  }

  public static async loadLoginSession(token: string) {
    return Session.findOne({
      where: {
        token,
        type: SessionTypes.Login
      },
      relations: ['user'],
      select: ['id', 'expiresAt']
    });
  }
}
