import {PositionSet} from '../../models/domain/persisted/position-set';
import {NotFoundError} from '../../util/errors';
import {PositionSetPerformanceService} from '../transform/position-set-performance-service';
import {QuoteDataService} from '../transform/quote-data-service';

export class PositionSetQueryService {

  public static async getClosedPositionSets(userId: number) {
    const positionSets = await PositionSet.find({
      where: {
        userId,
        deleted: false,
        isOpen: false
      },
      relations: ['positions', 'trades', 'underlyingInstrument', 'positions.instrument']
    });
    await Promise.all(positionSets.map(positionSet => PositionSetPerformanceService.computePositionSetPerformance(positionSet)));
    // await PositionSetMetaService.populateMetaForPositionSets(positionSets);
    return positionSets;
  }

  public static async getOpenPositionSets(userId: number, includeStats?: boolean) {
    const positionSets = await PositionSet.find({
      where: {
        userId,
        deleted: false,
        isOpen: true
      },
      relations: ['positions', 'trades', 'underlyingInstrument', 'positions.instrument']
    });
    // if (includeStats) {
    //   await PositionSetMetaService.populateMetaForPositionSets(positionSets);
    // }
    // await Promise.all(positionSets.map(positionSet => PositionSetPerformanceService.computePositionSetPerformance(positionSet)));
    return positionSets;
  }

  public static async getPositionSetById(positionSetId: number) {
    const positionSet = await PositionSet.findOne({
      where: {
        id: positionSetId,
        deleted: false
      },
      relations: ['positions', 'trades', 'underlyingInstrument', 'positions.instrument']
    });
    if (!positionSet) {
      throw new NotFoundError('Position Set not found: ' + positionSetId);
    }
    // await PositionSetMetaService.populateMetaForPositionSets([positionSet]);
    if (positionSet.isOpen) {
      await QuoteDataService.populatePositionSetQuoteData(positionSet);
    }
    await PositionSetPerformanceService.computePositionSetPerformance(positionSet);
    return positionSet;
  }
}
