import {EntityManager} from 'typeorm';
import {Trade} from '../../models/domain/persisted/trade';
import {CreateTradeDto} from '../../models/dto/input-dtos/create-trade-dto';

export class TradeService {
  public static async createTrade(userId: number, dto: CreateTradeDto) {
    const unsaved = Trade.create(dto);
    unsaved.userId = userId;
    return unsaved.save();
  }

  public static async saveNewTrade(tx: EntityManager, unsavedTrade: Trade) {
    return tx.save(unsavedTrade);


    // if (instrumentType === InstrumentType.Equity) {
    // } else {
    //   console.log('Warning, unable to build position for ' + instrumentType + ' trade: ' + saved.id);
    // }

  }


}
