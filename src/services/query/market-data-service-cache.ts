export enum MarketDataServiceCacheType {
  LastTrade = 'last',
  Spread = 'spread',
  TodayOpen = 'today_open',
  Quote = 'quote'
}

const CACHE_EXPIRATION_MS = 10000;

interface ICachePair {
  ts: Date,
  value: any
}

export class MarketDataServiceCache {

  private cache: {[key in MarketDataServiceCacheType]: {[key: string]: ICachePair}} = {
    last: {}, spread: {}, today_open: {}, quote: {}
  };

  public get(type: MarketDataServiceCacheType, key: string) {
    const pair = this.cache[type][key];
    if (pair && new Date().getTime() - pair.ts.getTime() < CACHE_EXPIRATION_MS) {
      return pair.value;
    } else {
      return undefined;
    }
  }

  public put(type: MarketDataServiceCacheType, key: string, value: any) {
    this.cache[type][key] = {
      ts: new Date(),
      value
    };
  }
}
