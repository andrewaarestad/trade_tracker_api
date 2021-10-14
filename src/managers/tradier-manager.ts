import moment = require('moment');
import {Moment} from 'moment';
import {ITradierBar, ITradierQuote, TradierClient, TradierEndpoints} from './tradier-client';
import {Config} from "../util/config";


// You will need to get an access token from https://developer.tradier.com/
// Possible endpoints are prod, beta, and sandbox
const tradier = new TradierClient(Config.TRADIER_API_KEY, TradierEndpoints.prod);

export class TradierManager {
  public static async getQuote(symbol: string): Promise<ITradierQuote> {
    return tradier.getQuote([symbol]);
  }

  public static async getTodayBar(symbol: string): Promise<ITradierBar> {
    console.log('getting price history');
    try {
      const now = moment();
      const start = moment().subtract(1, 'week');
      const result = await tradier.getPriceHistory(symbol, 'daily', this.formatDate(start), this.formatDate(now));
      // console.log('Result: ', result);
      return result.day[result.day.length-1];

    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public static async getUserProfile() {
    return tradier.getProfile();
  }

  public static async getActivePositions() {
    return tradier.getPositions();
  }

  public static async getAccount() {
    // todo
  }

  private static formatDate(date: Moment) {
    return date.format('YYYY-MM-DD');
  }
}
