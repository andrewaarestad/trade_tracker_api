/**
 * @module Middleware
 * @type {*|exports|module.exports}
 */


import bodyParser = require('body-parser');
import compression = require('compression');
import * as cors from 'cors';
import {Application, NextFunction, Request, Response} from 'express';
import {Responses} from '../routes/classes/responses';
import {InvalidParameterError, UnprocessableEntityError} from '../util/errors';


export class Middleware {

  public static registerPreRouteMiddleware(expressApp: Application) {
    /**
     * Permissive CORS
     */
    expressApp.use(cors());
    expressApp.options('*', cors() as any); // include before other routes

    /**
     * Express layouts,  assets
     */
    //expressApp.use(expressLayouts);
    //expressApp.use(express.static(path.join(__dirname, '')));


    expressApp.use(forceSSL);


    /**
     * BODY PARSING MIDDLEWARE
     */
    expressApp.use((req: Request, res: Response, next: NextFunction) => {
      const contentType = req.headers['content-type'];
      if (req.method === 'GET') {
        // No body parsing required for GET requests
        next();
      } else if (req.method === 'DELETE' && contentType === undefined) {
        // Delete request with no content-type specified, don't parse a body
        next();
      } else if (req.headers['content-length'] === '0') {
        next();
      } else if (contentType === undefined) {
        Responses.sendErrorResponse(req, res, new InvalidParameterError('Content-Type header not found, but content-length was ' + req.headers['content-length']));
        // Responses.sendErrorResponse(req, res, 'BodyParsingMiddleware')(({
        //   code: 400,
        //   error: {
        //     message: 'Content-Type header not found, but content-length was ' + req.headers['content-length'],
        //     headers: req.headers
        //   }
        // }));
      } else if (contentType.indexOf('multipart/form-data') > -1) {
        Responses.sendErrorResponse(req, res, new InvalidParameterError('multipart/form-data not allowed for route: ' + req.url));
        // Responses.sendErrorResponse(req, res, 'BodyParsingMiddleware')(({
        //   code: 400,
        //   error: 'multipart/form-data not allowed for route: ' + req.url
        // }));
      } else if (contentType.indexOf('application/json') > -1) {

        // For this list of URLs, we need to skip the json body parsing middleware and just use raw
        if (['/api/v1/webhook/stripe'].indexOf(req.originalUrl) !== -1) {
          bodyParser.raw({type: 'application/json'})(req, res, next);
        } else {
          bodyParser.json({limit: '10mb'})(req, res, next);
        }
      } else if (contentType.indexOf('application/x-www-form-urlencoded') !== -1) {
        bodyParser.urlencoded({extended: true})(req, res, next);
      } else {
        Responses.sendErrorResponse(req, res, new InvalidParameterError('Unsupported Content-Type: ' + req.headers['content-type']));
        // Responses.sendErrorResponse(req, res, 'BodyParsingMiddleware')(({
        //   code: 400,
        //   error: 'Unsupported Content-Type: ' + req.headers['content-type']
        // }));
      }
    });

    /**
     * Middleware for handling bad requests e.g. malformed JSON
     */
    expressApp.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.log('error bad request: ' + err);
      Responses.sendErrorResponse(req, res, new UnprocessableEntityError('Bad request:  ' + err));
      // Responses.sendErrorResponse(req, res, 'BadRequestMiddleware')(({code: 422, error: 'bad request: ' + err}));
    });


  }


  public static registerCompressionMiddleware(app: Application) {

    app.use(compression());

  }

}


/**
 * Force SSL for the request.
 *
 * Looks at Heroku X-FORWARDED-PROTO header to ensure SSL was used.
 *
 * @param req
 * @param res
 * @param next
 */
function forceSSL(req: Request, res: Response, next: NextFunction) {
  const host = req.headers['host'] as string;
  if (req.headers['x-forwarded-proto'] !== 'https' && host && host.match(/localhost/) === null && host.match('127.0.0.1') === null) {
    // console.log('Insecure access, redirecting to secure. ' + req.headers['host']);
    res.redirect('https://' + req.headers['host'] + req.url);
  } else {
    next();
  }
}
