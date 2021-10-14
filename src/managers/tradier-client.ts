const axios = require('axios');
const ensureArray = require('ensure-array');
const querystring = require('querystring');

export interface ITradierQuote {
  'symbol': string,
  'description': string,
  'exch': string,
  'type': string,
  'last': number,
  'change': number,
  'volume': number,
  'open': number,
  'high': number,
  'low': number,
  'close': number | null,
  'bid': number,
  'ask': number,
  'change_percentage': number,
  'average_volume': number,
  'last_volume': number,
  'trade_date': number,
  'prevclose': number,
  'week_52_high': number,
  'week_52_low': number,
  'bidsize': number,
  'bidexch': string,
  'bid_date': number,
  'asksize': number,
  'askexch': string,
  'ask_date': number,
  'root_symbols': string
}

export interface ITradierBar {
  'date': string,
  'open': number,
  'high': number,
  'low': number,
  'close': number,
  'volume': number
}

export enum TradierEndpoints {
  prod = 'https://api.tradier.com/v1/',
  beta = 'https://api.tradier.com/beta/',
  sandbox = 'https://sandbox.tradier.com/v1/',
  stream = 'https://stream.tradier.com/v1'
}

// function parseSymbols(symbols: Array<string>) {
//   return ensureArray(symbols).join(',');
// }

function parseQuery(url: string, params?: {[key: string]: any}) {
  const query =
    params &&
    querystring.stringify(
      Object.keys(params).reduce((values: any, key) => {
        if (params[key] !== undefined) {
          values[key] = params[key];
        }
        return values;
      }, {})
    );
  return query ? `${url}?${query}` : url;
}

function parseData(data: any) {
  return typeof data === 'object'
    ? querystring.stringify(data)
    : querystring.parse(data);
}

export class TradierClient {
  private endpoint: TradierEndpoints;
  constructor(private accessToken: string, endpoint?: TradierEndpoints) {
    this.endpoint = endpoint || TradierEndpoints.prod;
    // this.accessToken = accessToken;
    // this.endpoint = endpoint;
  }

  // region HTTP
  public config() {
    return {
      baseURL: this.endpoint,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: 'application/json',
      },
    };
  }

  public get(url: string, params?: {[key: string]: any}, config?: {[key: string]: any}) {
    const urlWithParams = parseQuery(url, params);
    console.log('url: ', urlWithParams);
    return axios.request({
      method: 'get',
      url: urlWithParams,
      ...this.config(),
      ...config,
    });
  }

  public post(url: string, data?: {[key: string]: any}, config?: {[key: string]: any}) {
    return axios.request({
      method: 'post',
      url,
      data: parseData(data),
      ...this.config(),
      ...config,
    });
  }

  public put(url: string, data?: {[key: string]: any}, config?: {[key: string]: any}) {
    return axios.request({
      method: 'put',
      url,
      data: parseData(data),
      ...this.config(),
      ...config,
    });
  }

  public delete(url: string, config = {}) {
    return axios.request({
      method: 'delete',
      url,
      ...this.config(),
      ...config,
    });
  }
  // endregion

  // region User Data
  public getProfile() {
    //@ts-ignore
    return this.get('user/profile').then(({ data: { profile } }) => profile);
  }

  // getBalances() {
  //   return this.get('user/balances').then(({ data: { accounts } }) => accounts);
  // }
  //
  public getPositions() {
    return this.get('user/positions').then(
      ({ data: { accounts } }: any) => accounts
    );
  }
  //
  // getHistory() {
  //   return this.get('user/history').then(({ data: { accounts } }) => accounts);
  // }
  //
  // getGainloss() {
  //   return this.get('user/gainloss').then(({ data: { accounts } }) => accounts);
  // }
  //
  // getOrders() {
  //   return this.get('user/orders').then(({ data: { accounts } }) => accounts);
  // }
  // endregion

  // // region Account Data
  // getAccountBalances(account) {
  //   return this.get(`accounts/${account}/balances`).then(
  //     ({ data: { balances } }) => balances
  //   );
  // }
  //
  // getAccountPositions(account) {
  //   return this.get(`accounts/${account}/positions`).then(
  //     ({ data: { positions } }) => positions
  //   );
  // }
  //
  // getAccountHistory(account) {
  //   return this.get(`accounts/${account}/history`).then(
  //     ({ data: { history } }) => history
  //   );
  // }
  //
  // getAccountGainloss(account) {
  //   return this.get(`accounts/${account}/gainloss`).then(
  //     ({ data: { gainloss } }) => gainloss
  //   );
  // }
  //
  // getAccountOrders(account) {
  //   return this.get(`accounts/${account}/orders`).then(
  //     ({ data: { orders } }) => orders
  //   );
  // }
  //
  // getAccountOrder(account, orderId) {
  //   return this.get(`accounts/${account}/orders/${orderId}`).then(
  //     ({ data: { order } }) => order
  //   );
  // }
  // // endregion

  // // region Trading
  // createOrder(account, data) {
  //   return this.post(`accounts/${account}/orders`, data).then(
  //     ({ data: { order } }) => order
  //   );
  // }
  //
  // previewOrder(account, data) {
  //   return this.post(`accounts/${account}/orders`, {
  //     ...parseData(data),
  //     preview: true,
  //   }).then(({ data: { order } }) => order);
  // }
  //
  // changeOrder(account, orderId, data) {
  //   return this.put(`accounts/${account}/orders/${orderId}`, data).then(
  //     ({ data: { order } }) => order
  //   );
  // }
  //
  // cancelOrder(account, orderId) {
  //   return this.delete(`accounts/${account}/orders/${orderId}`).then(
  //     ({ data: { order } }) => order
  //   );
  // }
  // // endregion

  // region Market Data
  public getQuote(symbols: Array<string>): Promise<ITradierQuote> {
    return this.get('markets/quotes', {
      symbols: ensureArray(symbols).join(','),
    }).then(
      ({
         data: {
           quotes: { quote },
         },
       }: any) => quote
    );
  }

  // getTimesales(symbol, interval, start, end, sessionFilter) {
  //   return this.get('markets/timesales', {
  //     symbol,
  //     interval,
  //     start,
  //     end,
  //     session_filter: sessionFilter,
  //   }).then(({ data: { series } }) => series);
  // }
  //
  // getOptionChains(symbol, expiration) {
  //   return this.get('markets/options/chains', { symbol, expiration }).then(
  //     ({ data: { options } }) => options
  //   );
  // }

  // getOptionStrikes(symbol, expiration) {
  //   return this.get('markets/options/strikes', { symbol, expiration }).then(
  //     ({ data: { strikes } }) => strikes
  //   );
  // }
  //
  // getOptionExpirations(symbol, includeAllRoots) {
  //   return this.get('markets/options/expirations', {
  //     symbol,
  //     includeAllRoots,
  //   }).then(({ data: { expirations } }) => expirations);
  // }

  public getPriceHistory(symbol: string, interval: 'daily', start: string, end: string) {
    console.log('getPriceHistory');
    return this.get('markets/history', {
      symbol,
      interval,
      start,
      end,
    }).then(({ data: { history } }: any) => {
      return history;
    });
  }

  // getClock() {
  //   return this.get('markets/clock').then(({ data: { clock } }) => clock);
  // }
  //
  // getCalendar(market, year) {
  //   return this.get('markets/calendar', { market, year }).then(
  //     ({ data: { calendar } }) => calendar
  //   );
  // }
  //
  // search(q, indexes = true) {
  //   return this.get('markets/search', { q, indexes }).then(
  //     ({ data: { securities } }) => securities
  //   );
  // }
  //
  // lookup(q, exchanges, types) {
  //   return this.get('markets/lookup', { q, exchanges, types }).then(
  //     ({ data: { securities } }) => securities
  //   );
  // }

  // // region Fundamentals (BETA)
  // getCompany(symbols: Array<string>) {
  //   return this.get(
  //     'markets/fundamentals/company',
  //     { symbols: parseSymbols(symbols) },
  //     { baseURL: URLS.beta }
  //   ).then(({ data: { items } }) => items);
  // }
  //
  // getCalendars(symbols: Array<string>) {
  //   return this.get(
  //     'markets/fundamentals/calendars',
  //     { symbols: parseSymbols(symbols) },
  //     { baseURL: URLS.beta }
  //   ).then(({ data: { items } }) => items);
  // }
  //
  // getDividends(symbols: Array<string>) {
  //   return this.get(
  //     'markets/fundamentals/dividends',
  //     { symbols: parseSymbols(symbols) },
  //     { baseURL: URLS.beta }
  //   ).then(({ data: { items } }) => items);
  // }
  //
  // getCorporateActions(symbols: Array<string>) {
  //   return this.get(
  //     'markets/fundamentals/corporate_actions',
  //     { symbols: parseSymbols(symbols) },
  //     { baseURL: URLS.beta }
  //   ).then(({ data: { items } }) => items);
  // }
  //
  // getRatios(symbols: Array<string>) {
  //   return this.get(
  //     'markets/fundamentals/ratios',
  //     { symbols: parseSymbols(symbols) },
  //     { baseURL: URLS.beta }
  //   ).then(({ data: { items } }) => items);
  // }
  //
  // getFinancials(symbols: Array<string>) {
  //   return this.get(
  //     'markets/fundamentals/financials',
  //     { symbols: parseSymbols(symbols) },
  //     { baseURL: URLS.beta }
  //   ).then(({ data: { items } }) => items);
  // }
  //
  // getStatistics(symbols: Array<string>) {
  //   return this.get(
  //     'markets/fundamentals/statistics',
  //     { symbols: parseSymbols(symbols) },
  //     { baseURL: URLS.beta }
  //   ).then(({ data: { items } }) => items);
  // }
  // // endregion
  //
  // // region Watchlists
  // getWatchlists() {
  //   return this.get('/watchlists').then(
  //     ({ data: { watchlists } }) => watchlists
  //   );
  // }
  //
  // getWatchlist(id) {
  //   return this.get(`/watchlists/${id}`).then(
  //     ({ data: { watchlist } }) => watchlist
  //   );
  // }
  //
  // createWatchlist(name, symbols) {
  //   return this.post('/watchlists', {
  //     name,
  //     symbols: parseSymbols(symbols),
  //   }).then(({ data: { watchlist } }) => watchlist);
  // }
  //
  // updateWatchlist(id, name, symbols) {
  //   return this.put(`/watchlists/${id}`, {
  //     name,
  //     symbols: parseSymbols(symbols),
  //   }).then(({ data: { watchlist } }) => watchlist);
  // }
  //
  // deleteWatchlist(id) {
  //   return this.delete(`/watchlists/${id}`).then(
  //     ({ data: { watchlists } }) => watchlists
  //   );
  // }
  //
  // addSymbols(id, symbols) {
  //   return this.post(`/watchlists/${id}/symbols`, {
  //     symbols: parseSymbols(symbols),
  //   }).then(({ data: { watchlist } }) => watchlist);
  // }
  //
  // removeSymbols(id, symbol) {
  //   return this.delete(`/watchlists/${id}/symbols/${symbol}`).then(
  //     ({ data: { watchlist } }) => watchlist
  //   );
  // }
  // // endregion

  // // region Streaming
  // createSession() {
  //   return this.post('markets/events/session');
  // }
  //
  // getEvents(sessionid, symbols, filter, linebreak) {
  //   return this.post(
  //     'markets/events',
  //     {
  //       sessionid,
  //       symbols: parseSymbols(symbols),
  //       filter,
  //       linebreak,
  //     },
  //     { baseURL: URLS.stream }
  //   ).then(({ data: { data } }) => data);
  // }
  // // endregion
}

