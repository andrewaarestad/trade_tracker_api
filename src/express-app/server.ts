import * as express from 'express';
import * as http from 'http';
// import * as PJSON from 'pjson';
import {PostgresManager} from '../managers/postgres-manager';
import {Routes} from '../routes/routes';
import {Config} from '../util/config';
import {Middleware} from './middleware';

// const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;

const clients: any = {};

// This code generates unique userid for everyuser.
const getUniqueID = () => {
  const s4 = () => Math.floor((Math.random() + 1) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

export class Server {

  public app: express.Application;

  private httpServer: http.Server | null = null;

  constructor() {

    this.app = express();

    Middleware.registerCompressionMiddleware(this.app);
    Middleware.registerPreRouteMiddleware(this.app);

    // Postgres.connect(Config.POSTGRES_URL);

    // Controller.configure({
    //   instrumentAllRequests: Config.INSTRUMENT_EACH_REQUEST,
    //   instrumentAllErrors: Config.INSTRUMENT_ERRORS_ALL,
    //   instrument500Errors: Config.INSTRUMENT_ERRORS_500,
    //   instrumentErrorRequestBodies: Config.INSTRUMENT_ERROR_REQUEST_BODIES,
    //   instrumentErrorRequestBodiesRouteBlacklist: [
    //     '/api/v1/login'
    //   ],
    //   environmentDescriptor: Config.ENVIRONMENT_NAME,
    //   packageConfig: {
    //     packageName: PJSON.name,
    //     packageDescription: PJSON.description,
    //     packageVersion: PJSON.version
    //   }
    // });

    // CrudConfig.setControllerConfig(Controller.getConfiguration());

    Routes.register(this.app);

  }


  public async start() {

    await PostgresManager.connect(Config.API_CONNECTION_POOL_SIZE);

    await this.startHttp();


  }

  private async startHttp() {

    return new Promise<void>((resolve, reject) => {


      //create http server
      // const app = new Server().app;
      // app.set('port', normalizePort(Config.PORT));
      this.httpServer = http.createServer(this.app);


      //debug("Listening...");
      //listen on provided ports
      this.httpServer.listen(normalizePort(Config.PORT));

      // start websocket
      const wsServer = new webSocketServer({
        httpServer: this.httpServer
      });

      wsServer.on('request', function(request: any) {
        var userID = getUniqueID();
        console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
        // You can rewrite this part of the code to accept only the requests from allowed origin
        const connection = request.accept(null, request.origin);
        clients[userID] = connection;
        console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));
      });

      //add error handler
      this.httpServer.on('error', (error: any) => {
        if (error.syscall !== 'listen') {
          throw error;
        }


        // handle specific listen errors with friendly messages
        switch (error.code) {
          case 'EACCES':
            console.error('Requires elevated privileges');
            process.exit(1);
            break;
          case 'EADDRINUSE':
            console.error('Address is already in use');
            process.exit(1);
            break;
          default:
            throw error;
        }

        reject(error);
      });

      //start listening on port
      this.httpServer.on('listening', () => {
        if (this.httpServer) {
          const addr = this.httpServer.address() as any;
          // var bind = typeof addr === "string"
          //   ? "pipe " + addr
          //   : "port " + addr.port;
          console.log('Server running at ' + Config.ServerUrl + ':' + addr.port);
          resolve();
        }
      });


    });

  }
}

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val: string) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

