import {NextFunction, Request, Response} from 'express';
import {User} from '../models/domain/persisted/user';
import {Responses} from '../routes/classes/responses';
import {UnauthorizedError} from '../util/errors';

export abstract class Authenticator {
  protected req: any;
  protected res: any;

   get handler() {
    return (req: Request, res: Response, next: NextFunction) => {
      this.req = req;
      this.res = res;
      this.authenticate()
      .then(result => {
        if (result) {
          if (result.constructor === User) {
            (req as any).user = result;
          }
        }
        next();
      })
      .catch(err => {
        Responses.sendErrorResponse(req, res, new UnauthorizedError(err.error || err.toLocaleString() ));
      });
    };
  }

  protected abstract authenticate(): Promise<User | undefined | void>;

}
