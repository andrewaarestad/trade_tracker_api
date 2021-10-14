import {PositionSet} from '../../models/domain/persisted/position-set';
import {PositionPerformanceClosed} from '../../models/domain/transient/position-performance-closed';
import {PositionPerformanceOpen} from '../../models/domain/transient/position-performance-open';
import {Calculations} from '../../util/calculations';
import {InternalServerError} from '../../util/errors';
import {PositionPerformanceService} from './position-performance-service';

export class PositionSetPerformanceService {
  public static async computePositionSetPerformance(positionSet: PositionSet) {

    await Promise.all(positionSet.positions.map(position => PositionPerformanceService.computePositionPerformance(position)));

    if (positionSet.isOpen) {
      await this.computeOpenPositionSetPerformance(positionSet);
    } else {
      await this.computeClosedPositionSetPerformance(positionSet);
    }
  }

  private static async computeOpenPositionSetPerformance(positionSet: PositionSet) {

    // console.log('computeOpenPositionSetPerformance, ' + JSON.stringify(positionSet.positions));
    if (!positionSet.positions) {
      throw new InternalServerError('positionSet.positions must be loaded to compute performance');
    }

    positionSet.performanceOpen = new PositionPerformanceOpen();
    positionSet.performanceOpen.unrealizedGainUsd = 0;
    positionSet.performanceOpen.unrealizedGainTodayUsd = 0;

    for (var ii=0; ii<positionSet.positions.length; ii+=1) {
      const position = positionSet.positions[ii];
      if (!position.performanceOpen) {
        throw new InternalServerError('positionSet.position.performanceOpen must be loaded to compute positionSet.performanceOpen');
      }

      positionSet.performanceOpen.unrealizedGainUsd += position.performanceOpen.unrealizedGainUsd;
      positionSet.performanceOpen.unrealizedGainTodayUsd += position.performanceOpen.unrealizedGainTodayUsd;

      positionSet.performanceOpen.totalQuantity += position.currentQuantity;
      positionSet.performanceOpen.entryValue += position.currentQuantity * position.entryPrice;
    }
    positionSet.performanceOpen.netBasis = positionSet.performanceOpen.entryValue / (positionSet.performanceOpen.totalQuantity || 1);

    // console.log('positionSet.performanceOpen: ' + JSON.stringify(positionSet.performanceOpen, null, 2));
    positionSet.performanceOpen.unrealizedGainPercent = positionSet.performanceOpen.unrealizedGainUsd / positionSet.performanceOpen.entryValue;
    positionSet.performanceOpen.unrealizedGainTodayPercent = positionSet.performanceOpen.unrealizedGainTodayUsd / positionSet.performanceOpen.entryValue;
    // console.log('positionSet.performanceOpen: ' + JSON.stringify(positionSet.performanceOpen, null, 2));
  }

  private static async computeClosedPositionSetPerformance(positionSet: PositionSet) {
    if (!positionSet.positions) {
      throw new InternalServerError('positionSet.positions must be loaded to compute performance');
    }
    if (!positionSet.exitTime) {
      throw new InternalServerError('positionSet.exitTime must be set to compute closed performance');
    }
    positionSet.performanceClosed = new PositionPerformanceClosed();
    // let totalQuantity = 0;
    for (var ii=0; ii<positionSet.positions.length; ii+=1) {
      const position = positionSet.positions[ii];
      if (!position.performanceClosed) {
        throw new InternalServerError('positionSet.position.performanceClosed must be loaded to compute positionSet.performanceClosed');
      }
      if (!position.exitTime || !position.exitPrice || !position.exitValue) {
        throw new InternalServerError('positionSet.position must have exit data to compute positionSet.performanceClosed');
      }
      positionSet.performanceClosed.exitPrice += position.exitPrice;
      positionSet.performanceClosed.exitValue += position.exitValue;
      positionSet.performanceClosed.entryPrice += position.entryPrice;
      positionSet.performanceClosed.entryValue += position.entryValue;
      // totalQuantity += position.entryQuantity;
      positionSet.performanceClosed.realizedGainUsd += position.performanceClosed.realizedGainUsd;
    }

    // positionSet.performanceClosed.entryPrice = positionSet.performanceClosed.entryPrice / (totalQuantity || 1);
    // positionSet.performanceClosed.exitPrice = positionSet.performanceClosed.exitPrice / (totalQuantity || 1);

    if (positionSet.performanceClosed.realizedGainUsd && positionSet.performanceClosed.entryValue) {
      positionSet.performanceClosed.realizedGainPercent = Calculations.computeRealizedGainPercent(positionSet.performanceClosed.realizedGainUsd, positionSet.performanceClosed.entryValue);
    } else {
      positionSet.performanceClosed.realizedGainPercent = 0;
    }

    const timeInTrade = positionSet.entryTime.getTime() - positionSet.exitTime.getTime();
    positionSet.performanceClosed.realizedGainPercentAnnualized = Calculations.computeAnnualizedReturn(positionSet.performanceClosed.realizedGainUsd, timeInTrade);
    // console.log('percent: ', positionSet.performanceClosed.realizedGainPercent);
  }
}
