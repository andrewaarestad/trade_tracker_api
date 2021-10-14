import {Position} from '../../models/domain/persisted/position';
import {PositionPerformanceClosed} from '../../models/domain/transient/position-performance-closed';
import {PositionPerformanceOpen} from '../../models/domain/transient/position-performance-open';
import {Calculations} from '../../util/calculations';
import {InternalServerError} from '../../util/errors';

export class PositionPerformanceService {
  public static async computePositionPerformance(position: Position) {
    if (!position) {
      throw new InternalServerError('No position');
    }
    if (position.isOpen) {
      await this.computeOpenPositionPerformance(position);
    } else {
      await this.computeClosedPositionPerformance(position);
    }
  }

  private static async computeOpenPositionPerformance(position: Position) {

    console.log('computeOpenPositionPerformance, ' + position);

    if (!position.quoteData || !position.historicalData) {
      throw new InternalServerError('Cannot compute open position performance without quote data and historical data');
    }

    const timeInTrade = new Date().getTime() - position.entryTime.getTime();

    const quoteData = position.quoteData;
    const historicalData = position.historicalData;
    const last = quoteData.last;
    const open = historicalData.todayOpen;
    const todayOpenValue = position.currentQuantity * open;
    const entryValue = position.currentQuantity * position.entryPrice;
    const currentValue = position.currentQuantity * last;
    position.performanceOpen = new PositionPerformanceOpen();
    position.performanceOpen.unrealizedGainTodayUsd = currentValue - todayOpenValue;
    position.performanceOpen.unrealizedGainTodayPercent = position.performanceOpen.unrealizedGainTodayUsd / todayOpenValue;
    position.performanceOpen.unrealizedGainUsd = currentValue - entryValue;
    position.performanceOpen.unrealizedGainPercent = position.performanceOpen.unrealizedGainUsd / entryValue;
    position.performanceOpen.unrealizedGainPercentAnnualized = Calculations.computeAnnualizedReturn(position.performanceOpen.unrealizedGainUsd, timeInTrade);
    console.log('performanceOpen: ' + JSON.stringify(position.performanceOpen));
  }

  private static async computeClosedPositionPerformance(position: Position) {

    if (!position.exitPrice || !position.exitTime) {
      throw new InternalServerError('Cannot compute close position performance for position without exitPrice or exitTime');
    }
    const timeInTrade = position.exitTime.getTime() - position.entryTime.getTime();

    position.performanceClosed = new PositionPerformanceClosed();

    position.performanceClosed.entryQuantity = position.entryQuantity;
    position.performanceClosed.entryPrice = position.entryPrice;
    position.performanceClosed.entryValue = position.entryValue;
    position.performanceClosed.exitPrice = position.exitPrice;
    position.performanceClosed.exitValue = position.exitPrice * position.entryQuantity;

    position.performanceClosed.realizedGainUsd = position.entryQuantity * position.exitPrice - position.entryQuantity * position.entryPrice;
    position.performanceClosed.realizedGainPercent = Calculations.computeRealizedGainPercent(position.performanceClosed.realizedGainUsd, position.performanceClosed.entryValue);
    position.performanceClosed.realizedGainPercentAnnualized = Calculations.computeAnnualizedReturn(position.performanceClosed.realizedGainPercent, timeInTrade);


    // console.log('computing realized gain ', position.performanceClosed.realizedGainUsd, ' ', position.entryValue, ' = ', position.performanceClosed.realizedGainPercent);
    // console.log(position.performanceClosed);
  }
}
