import {Position} from '../../models/domain/persisted/position';
import {PositionSet} from '../../models/domain/persisted/position-set';
import {HistoricalData} from '../../models/domain/transient/historical-data';
import {QuoteData} from '../../models/domain/transient/quote-data';
import {InternalServerError} from '../../util/errors';
import {MarketDataService} from '../query/market-data-service';

export class QuoteDataService {
  public static async populatePositionSetQuoteData(positionSet: PositionSet) {
    await Promise.all(positionSet.positions.map(position => this.populatePositionQuoteData(position)));

  }

  public static async populatePositionQuoteData(position: Position) {

    if (!position.instrument) {
      throw new InternalServerError('Position.instrument must be loaded to fetch quote data');
    }

    position.quoteData = new QuoteData();

    position.quoteData.timestamp = new Date();
    const quote = await MarketDataService.getQuote(position.instrument.symbol);
    // const lastTrade = await MarketDataService.getLastTrade(position.instrument.symbol);
    // const spread = await MarketDataService.getLastQuote(position.instrument.symbol);

    position.quoteData.last = quote.last;
    position.quoteData.bid = quote.bid;
    position.quoteData.ask = quote.ask;

    position.historicalData = new HistoricalData();
    position.historicalData.todayOpen = (await MarketDataService.getTodayOpen(position.instrument.symbol)).open;


  }
}
