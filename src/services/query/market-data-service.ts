import {ITradierBar, ITradierQuote} from '../../managers/tradier-client';
import {TradierManager} from '../../managers/tradier-manager';
import {MarketDataServiceCache, MarketDataServiceCacheType} from './market-data-service-cache';

export class MarketDataService {

  private static cache = new MarketDataServiceCache();

  public static async getQuote(symbol: string) {
    let quote: ITradierQuote = this.cache.get(MarketDataServiceCacheType.Quote, symbol);
    if (!quote) {
      console.log('last trade for ' + symbol + ' not cached, fetching');
      quote = await TradierManager.getQuote(symbol);
      this.cache.put(MarketDataServiceCacheType.Quote, symbol, quote);
    }
    return quote;
  }

  // public static async getLastTrade(symbol: string) {
  //
  //   let lastTrade: number = this.cache.get(MarketDataServiceCacheType.LastTrade, symbol);
  //   if (!lastTrade) {
  //     console.log('last trade for ' + symbol + ' not cached, fetching');
  //     lastTrade = await TradierManager.getLastTrade(symbol);
  //     // lastTrade = await AlpacaManager.getLastTrade(symbol);
  //     this.cache.put(MarketDataServiceCacheType.LastTrade, symbol, lastTrade);
  //   }
  //   return lastTrade;
  //
  // }
  //
  // public static async getLastQuote(symbol: string) {
  //
  //   let spread: LastQuote = this.cache.get(MarketDataServiceCacheType.Spread, symbol);
  //   if (!spread) {
  //     spread = await AlpacaManager.getSpread(symbol);
  //     this.cache.put(MarketDataServiceCacheType.Spread, symbol, spread);
  //   }
  //   return spread;
  // }

  public static async getTodayOpen(symbol: string) {
    let todayBar: ITradierBar = this.cache.get(MarketDataServiceCacheType.TodayOpen, symbol);
    if (!todayBar) {
      // todayOpen = await AlpacaManager.getTodayOpen(symbol);
      todayBar = await TradierManager.getTodayBar(symbol);
      this.cache.put(MarketDataServiceCacheType.TodayOpen, symbol, todayBar);
    }
    return todayBar;
  }


}
