import { AlpacaClient } from '@master-chief/alpaca';
import {Config} from '../util/config';
import {InternalServerError} from '../util/errors';

const client = new AlpacaClient({
  credentials: {
    key: Config.ALPACA_KEY_ID,
    secret: Config.ALPACA_KEY_SECRET,
    // access_token: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    paper: true,
  },
  rate_limit: true,
});


export class AlpacaManager {

  public static async getLastTrade(symbol: string) {
    const result = await client.getLastTrade({ symbol });
    return result.last.price;
  }

  public static async getSpread(symbol: string) {
    const result = await client.getLastQuote({symbol});
    return result;
  }

  public static async getTodayOpen(symbol: string) {
    const result = await client.getBars({
      timeframe: 'day',
      symbols: [symbol],
      limit: 1,
      end: new Date()
    });
    if (!result[symbol] || result[symbol].length === 0) {
      throw new InternalServerError('Unable to fetch today open for ' + symbol);
    }
    return result[symbol][0].o;
  }

}
