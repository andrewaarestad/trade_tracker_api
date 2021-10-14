import * as e from 'express';
import {AuthenticatedRouter} from 'express-authenticated-router';
import {XAuthTokenUserAuthenticator} from '../../auth/x-auth-token-user-authenticator';
import {ControllerFactory} from '../classes/controller-factory';
import {GetClosedPositionsDashboard} from './v1/dashboard/closed/get';
import {GetOpenPositionsDashboard} from './v1/dashboard/open/get';
import {LoginController} from './v1/login/post';
import {CreatePositionController} from './v1/position/post';
import {GetPositionSetQuoteDataController} from './v1/position_set/_position_set_id/quotes/get';
import {CreatePositionSetController} from './v1/position_set/post';
import {SignupUserController} from './v1/signup/post';
import {SyncAccountController} from './v1/sync/account/post';
import {CreateTradeController} from './v1/trade/post';
import {GetLoggedInUserController} from './v1/user/get';


export class V1ApiRoutes {

  public static buildAndMountRoutes(expressApp: e.Application, mountPoint: string) {

    expressApp.use(mountPoint, AuthenticatedRouter.build({
      controllerBuilder: ControllerFactory.jsonApi
    }, router => {

      router.route('/login').post(LoginController);
      router.route('/signup').post(SignupUserController);

    }));

    expressApp.use(mountPoint, AuthenticatedRouter.build({
      controllerBuilder: ControllerFactory.jsonApi,
      middleware: [
        new XAuthTokenUserAuthenticator().handler
      ]
    }, router => {

      router.route('/dashboard/closed').get(GetClosedPositionsDashboard);
      router.route('/dashboard/open').get(GetOpenPositionsDashboard);
      router.route('/position_set').post(CreatePositionSetController);
      router.route('/position_set/:position_set_id/quotes').get(GetPositionSetQuoteDataController);
      router.route('/position').post(CreatePositionController);
      router.route('/sync/account').post(SyncAccountController);
      router.route('/trade').post(CreateTradeController);
      router.route('/user').get(GetLoggedInUserController);

    }));


  }


}
