import * as e from 'express';
import * as moment from 'moment';
import {Session} from '../../models/domain/persisted/session';
import {User} from '../../models/domain/persisted/user';
import {SessionTypes} from '../../models/enums/session-types';
import {UnauthorizedError} from '../../util/errors';
import {Keygen} from '../../util/keygen';
import {PasswordUtil} from '../../util/password-util';

export class SessionService {

  public static async createLoginSession(user: User) {
    const session = Session.create({
      userId: user.id,
      token: Keygen.uid(40),
      type: SessionTypes.Login,
      expiresAt: moment().add(30, 'day').toDate()
    });
    await session.save();
    session.user = user;
    return session;
  }

  public static async loginUser(req: e.Request, email: string, password: string): Promise<Session> {
    // console.log('SessionService.loginUser');
    const user = await User.findOne({where: {email, deleted: false}});
    (req as any).user = user;
    if (!user) {
      console.log('User not found for login: ' + email);
      throw new UnauthorizedError('Invalid email', {code: 'login.email.not.found'});
    } else if (!await PasswordUtil.verifyPassword(password, user.password)) {
      console.log('Failed password for login: ' + email);
      throw new UnauthorizedError('Invalid password', {code: 'login.password.fail'});
    }

    // 7-20-2020: We found that logging out all other sessions was too problematic due to client testing with multiple browsers
    // await this.invalidateExistingSessions(user.id);
    return this.createLoginSession(user);
  }


  // public static async invalidateExistingSessionsForUser(userId: number) {
  //   // console.log('SessionService.invalidateExistingSessions');
  //   const sessions = await Session.find({
  //     userId,
  //     type: In([SessionTypes.Login, SessionTypes.ForgotPassword]),
  //     deleted: false
  //   });
  //   await new PromiseQueue(1).runAll(sessions.map(existingSession => async() => {
  //     existingSession.type = SessionTypes.Invalidated;
  //     existingSession.deleted = true;
  //     return existingSession.save();
  //   }));
  // }

}
