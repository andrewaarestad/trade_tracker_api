
function required(target: any, key: any) {
  if (!process.env[key]) {
    console.error('Config', key + ' environment variable not found, terminating server...');
    process.exit(1);
  } else {
    target[key] = process.env[key];
  }
}


export class Config {

  // Required env vars

  @required public static POSTGRES_URL: string;
  @required public static ENVIRONMENT_NAME: string;
  @required public static ALPACA_KEY_ID: string;
  @required public static ALPACA_KEY_SECRET: string;
  @required public static TRADIER_API_KEY: string;


  // Optional vars

  public static API_CONNECTION_POOL_SIZE = process.env.API_CONNECTION_POOL_SIZE ? parseInt(process.env.API_CONNECTION_POOL_SIZE) : 10;

  public static PORT = process.env.PORT || '3000';

  public static INSTRUMENT_ERROR_REQUEST_BODIES = process.env.INSTRUMENT_ERROR_REQUEST_BODIES === 'true';
  public static INSTRUMENT_ERRORS_500 = process.env.INSTRUMENT_ERRORS_500 === 'true';
  public static INSTRUMENT_ERRORS_ALL = process.env.INSTRUMENT_ERRORS_ALL === 'true';
  public static INSTRUMENT_EACH_REQUEST = process.env.INSTRUMENT_EACH_REQUEST === 'true';

  public static POSTGRES_USE_SSL = process.env.POSTGRES_NO_SSL === undefined || process.env.POSTGRES_NO_SSL === 'false';
  public static POSTGRES_LOGGING = process.env.POSTGRES_LOGGING === 'none' ? undefined : process.env.POSTGRES_LOGGING as any;

  // Derived vars

  public static ServerUrl = (process.env.ENVIRONMENT_NAME === 'localhost' ? 'http' : 'https') + '://' + process.env.SERVER_DOMAIN;
}

// function parseOptionalStringArrayVar(name: string): Array<string> {
//   const rawValue = process.env[name];
//   if (rawValue) {
//     try {
//       let value: Array<string> | string = JSON.parse(rawValue);
//       if (value.constructor === Array) {
//         return value as any;
//       } else {
//         return [value as any];
//       }
//     } catch (err) {
//       console.log(err);
//       throw new Error('Failed to parse env var: ' + name + ': ' + rawValue);
//     }
//   }
//   return [];
// }
