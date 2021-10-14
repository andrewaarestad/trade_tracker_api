import * as e from 'express';
import {AuthenticatedRouter} from 'express-authenticated-router';
import {XAuthTokenUserAuthenticator} from '../../auth/x-auth-token-user-authenticator';
import {ControllerFactory} from '../classes/controller-factory';
import {PingTdaController} from './v1/tda/ping';

export class V1AdminRoutes {
  public static buildAndMountRoutes(expressApp: e.Application, mountPoint: string) {

    expressApp.use(mountPoint, AuthenticatedRouter.build({
      controllerBuilder: ControllerFactory.jsonApi,
      middleware: [
        new XAuthTokenUserAuthenticator().handler
      ]
    }, router => {

      router.route('/tda/ping').post(PingTdaController);
      // nothign yet

    }));

  }

}
