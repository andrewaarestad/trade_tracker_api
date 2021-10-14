import {PromiseQueue} from 'hc-utilities';
import {EntityManager, IsNull} from 'typeorm';
import {Position} from '../../models/domain/persisted/position';
import {PositionSet} from '../../models/domain/persisted/position-set';
import {Trade} from '../../models/domain/persisted/trade';
import {CreatePositionDto} from '../../models/dto/input-dtos/create-position-dto';
import {PositionSetService} from './position-set-service';

export class PositionService {
  public static async createPosition(userId: number, dto: CreatePositionDto) {
    const untrade = Position.create(dto);
    untrade.userId = userId;
    return untrade.save();
  }

  public static async findPositionsForPositionSet(positionSetId: number) {
    return Position.find({
      where: {
        positionSetId,
        deleted: false
      }
    });
  }

  public static async buildPositionFromOrderTrades(tx: EntityManager, trades: Array<Trade>) {

    console.log('buildPositionFromOrderTrades: ', trades.length);

    const matchedPositions = await new PromiseQueue(1).runAll(trades.map(trade => async() => this.matchOpenPosition(trade)));

    console.log('matchedPositions: ', matchedPositions.map(p => p?.id));

    let anyMatch = (matchedPositions.filter(p => !!p).length > 0);

    console.log('anyMatch: ', anyMatch);

    const matchedPositionSetIds = new Set<number>(matchedPositions.filter(p => !!p).map(p => p!.positionSet!.id));

    console.log('matchedPositionSets: ', matchedPositionSetIds.size);

    if (matchedPositionSetIds.size > 1) {
      console.log('Warning, multi-trade orders that match multiple existing position sets not supported, creating new position set.');
      console.log(matchedPositionSetIds);
      anyMatch = false;
    }

    if (anyMatch) {


      // console.log('positionSets: ', matchedPositionSets);

      // const positionSet: PositionSet = matchedPositionSets.values().next().value;
      const positionSet = matchedPositions.filter(p => !!p)[0]!.positionSet!;

      positionSet.positions = await PositionService.findPositionsForPositionSet(positionSet.id);

      console.log('We matched a position set: ' + positionSet.id);

      await new PromiseQueue(1).runAll(trades.map(trade => async() => {
        const matchedPosition = this.matchOpenPositionInPositionSet(positionSet, trade);
        if (matchedPosition) {
          matchedPosition.positionSet = positionSet;
          console.log('matched open position: ' + matchedPosition.id);
          return this.updatePositionFromTrade(tx, matchedPosition, trade);
        } else {
          console.log('we need to open a new position');
          return this.openPositionFromTrade(tx, trade, positionSet.id);
        }
      }));

      console.log('Now updating the position set.');

      await PositionSetService.updatePositionSet(positionSet, trades[0].executionTime);

      console.log('Updated position set: ', positionSet.id, ', isOpen: ', positionSet.isOpen);

      return positionSet;

    } else {

      console.log('No position sets matched.');

      const newPositions = await new PromiseQueue(1).runAll(trades.map(trade => async() => {
        return this.openPositionFromTrade(tx, trade);
      }));

      console.log('newPositions: ', newPositions.length);

      // create position set for the new positions

      const positionSet = await PositionSetService.openPositionSetFromPositions(tx, newPositions);

      console.log('Built position set: ', positionSet.id);

      await new PromiseQueue(1).runAll(newPositions.map(newPosition => async() => {
        newPosition.positionSetId = positionSet.id;
        await tx.save(newPosition);
      }));

      await new PromiseQueue(1).runAll(trades.map(trade => async() => {
        trade.positionSetId = positionSet.id;
        await tx.save(trade);
      }));

      return positionSet;
    }

  }

  // public static async buildPositionFromTrade(trade: Trade) {
  //
  //   const matchedPosition = await this.matchOpenPosition(trade);
  //
  //   if (matchedPosition) {
  //
  //     await this.updatePositionFromTrade(matchedPosition, trade);
  //
  //   } else {
  //
  //     // If instrument type is option, search for an open position in the underlying
  //
  //     // If instrument type is equity, search for an option position to match
  //
  //     await this.openPositionFromTrade(trade);
  //   }
  // }

  private static async openPositionFromTrade(tx: EntityManager, trade: Trade, positionSetId?: number) {

    console.log('openPositionFromTrade: ', trade.externalId);

    const newPosition = await tx.save(Position.create({
      entryTime: trade.executionTime,
      currentQuantity: trade.quantity,
      entryQuantity: trade.quantity,
      entryPrice: trade.price,
      entryValue: trade.value,
      userId: trade.userId,
      positionSetId,
      instrumentId: trade.instrumentId,
      brokerageAccountId: trade.brokerageAccountId
    }));

    trade.positionId = newPosition.id;
    if (positionSetId) {
      trade.positionSetId = positionSetId;
    }
    await tx.save(trade);

    return newPosition;

  }

  private static async updatePositionFromTrade(tx: EntityManager, matchedPosition: Position, trade: Trade) {
    if (!matchedPosition.positionSet) {
      console.warn('Warning, unable to update position with no position set: ' + matchedPosition.id);
      return matchedPosition;
    }

    trade.positionId = matchedPosition.id;
    trade.positionSetId = matchedPosition.positionSetId;
    await tx.save(trade);

    matchedPosition.currentQuantity += trade.quantity;

    if (matchedPosition.currentQuantity === 0) {
      // closing trade

      matchedPosition.exitTime = trade.executionTime;
      matchedPosition.exitPrice = trade.price;
      matchedPosition.exitValue = trade.value;

      matchedPosition.plClose = matchedPosition.exitValue + matchedPosition.entryValue;
      matchedPosition.plClose = parseFloat(matchedPosition.plClose.toFixed(4));
      // console.log('plClose: ' + matchedPosition.plClose + ', ' + matchedPosition.exitCost + ', ' + matchedPosition.entryCost);

      await tx.save(matchedPosition);

      // matchedPosition.positionSet.isOpen = false;
      // matchedPosition.positionSet.exitTime = trade.executionTime;
      //
      // await matchedPosition.positionSet.save();


      console.log('Closed position: ' + matchedPosition.id);

    }

    return matchedPosition;


  }

  private static matchOpenPositionInPositionSet(positionSet: PositionSet, trade: Trade): Position | undefined {
    let match: Position | undefined = undefined;
    positionSet.positions?.forEach(position => {
      if (position.instrumentId === trade.instrumentId && !position.exitTime) {
        match = position;
      }
    });
    return match;
  }

  private static async matchOpenPosition(trade: Trade) {

    const candidates = await Position.find({
      where: {
        exitTime: IsNull(),
        instrumentId: trade.instrumentId
      },
      relations: ['positionSet']
    });

    if (candidates.length > 1) {
      console.warn('Warning, more than one candidate position: ' + JSON.stringify(candidates));
    }

    return candidates.length > 0 ? candidates[0] : undefined;
  }
}
