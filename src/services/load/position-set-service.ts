import {EntityManager} from 'typeorm';
import {Position} from '../../models/domain/persisted/position';
import {PositionSet} from '../../models/domain/persisted/position-set';
import {Trade} from '../../models/domain/persisted/trade';
import {InstrumentType} from '../../models/enums/instrument-type';
import {PositionSetType} from '../../models/enums/position-set-type';
import {InternalServerError} from '../../util/errors';

export class PositionSetService {

  public static async openPositionSetFromPositions(tx: EntityManager, positions: Array<Position>) {
    console.log('openPositionSetFromPositions: ', positions.length);

    if (positions.length === 0) {
      throw new InternalServerError('Unable to build position set from zero positions');
    }


    // TODO: Handle all the different cases


    if (positions.length === 1) {

      console.log('building unpaired position set');

      const position = positions[0];

      return tx.save(PositionSet.create({
        type: PositionSetType.Unpaired,
        isOpen: true,
        brokerageAccountId: position.brokerageAccountId,
        userId: position.userId,
        underlyingInstrumentId: position.instrumentId,
        entryTime: position.entryTime
      }));

    } else if (positions.length === 2) {

      console.log('building vertical position set');

      const position = positions[0];

      return tx.save(PositionSet.create({
        type: PositionSetType.Vertical,
        isOpen: true,
        brokerageAccountId: position.brokerageAccountId,
        userId: position.userId,
        underlyingInstrumentId: position.instrumentId,
        entryTime: position.entryTime
      }));

    } else {

      throw new InternalServerError('Cannot build position set with ' + positions.length + ' positions');

    }
  }

  public static async openPositionSetFromTrade(trade: Trade, instrumentType: InstrumentType) {

    if (instrumentType === InstrumentType.Option) {
      // Search for an open option position to pair this with

      // to match this as a vertical, search for an open position in an option with the same underlying with the same expiration date

      // To do this, some refactoring is going to need to happen:
      // we need to parse the underlying instrument from the option symbol
      // we need to store this underlying instrument in the position and position set for this query
      //  we also need to parse the expiration from the option symbol, and store this in the position

      return PositionSet.create({
        type: PositionSetType.Unpaired,
        isOpen: true,
        brokerageAccountId: trade.brokerageAccountId,
        userId: trade.userId,
        underlyingInstrumentId: trade.instrumentId,
        entryTime: trade.executionTime
      }).save();

    } else {
      return PositionSet.create({
        type: PositionSetType.Unpaired,
        isOpen: true,
        brokerageAccountId: trade.brokerageAccountId,
        userId: trade.userId,
        underlyingInstrumentId: trade.instrumentId,
        entryTime: trade.executionTime
      }).save();
    }


  }

  public static async updatePositionSet(positionSet: PositionSet, tradeTime: Date) {
    // console.log('updatePositionSet: ', positionSet);
    if (!positionSet) {
      throw new InternalServerError('No position set');
    }
    if (!positionSet.positions) {
      throw new InternalServerError('Cannot update position set with no positions');
    }
    if (positionSet.isOpen) {
      let isClosing = true;
      positionSet.positions.forEach(position => {
        if (position.currentQuantity !== 0) {
          isClosing = false;
        }
      });
      if (isClosing) {
        await this.closePositionSet(positionSet, tradeTime);
      }
    }
    return positionSet;
  }

  private static async closePositionSet(positionSet: PositionSet, tradeTime: Date) {
    console.log('Closing position set: ', positionSet.id);
    positionSet.isOpen = false;
    positionSet.exitTime = tradeTime;
    await positionSet.save();
  }
}
