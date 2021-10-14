import * as e from 'express';
import {User} from '../../models/domain/persisted/user';
import {InvalidParameterError, UnprocessableEntityError} from '../../util/errors';

export abstract class Controller {
  protected static successCode = 200;
  constructor(protected request: e.Request, protected response: e.Response) {}
  public async start() {
    return this.handleRequest();
  }
  public abstract handleRequest(): Promise<any>;
  protected parseStringQuery(name: string): string | undefined {
    const value = this.request.query[name];
    if (value && typeof value !== 'string') {
      throw new UnprocessableEntityError('Expected string value for query param ' + name);
    }
    return value;
  }
  protected parseNumericQuery(name: string): number | undefined {
    return parseNumber(this.request.query[name], name);
  }
  protected parseNumericParam(name: string): number {
    return parseRequiredNumber(this.request.params[name], name);
  }
  protected parseBooleanQuery(name: string): boolean {
    return !!this.request.query[name] && this.request.query[name] !== '0' && this.request.query[name] !== 'false';
  }
}

export abstract class AuthenticatedUserController extends Controller {
  protected requestingUser: User;
  constructor(protected request: e.Request, protected response: e.Response) {
    super(request, response);
    this.requestingUser = (this.request as any).user;
    if (!this.requestingUser) {
      throw new Error('Failed to find user property on request, Controller was likely not mounted downstream from the appropriate Authenticator.');
    }
  }
}

function parseRequiredNumber(value: any, name: string): number {
  const num = parseNumber(value, name);
  if (!num) {
    throw new InvalidParameterError(name + ' required.');
  }
  return num;
}

function parseNumber(value: any, name: string): number | undefined {
  if (value && value.constructor === Array) {
    throw new UnprocessableEntityError('Expected single value for query param ' + name);
  }
  if (value) {
    value = parseFloat(value as string);
    if (isNaN(value)) {
      throw new UnprocessableEntityError('Invalid numeric value for query parameter ' + name + ': ' + value);
    }
  }
  return value;
}

