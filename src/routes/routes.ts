import express = require('express');
import {V1AdminRoutes} from './admin/v1-admin-routes';
import {V1ApiRoutes} from './api/v1-api-routes';
import {Controller404} from './root/404';
import {Root} from './root/root';

export class Routes {

  public static register(app: express.Application) {

    app.use(Root.build());

    V1AdminRoutes.buildAndMountRoutes(app, '/admin/v1');
    V1ApiRoutes.buildAndMountRoutes(app, '/api/v1');

    // 404 handler must be the last route in the chain
    app.use(Controller404.handler);
  }


}
