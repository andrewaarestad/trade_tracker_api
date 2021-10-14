import {Instrument} from '../../models/domain/persisted/instrument';
import {TdaInstrumentDto} from '../../models/dto/tda/tda-instrument-dto';
import {InvalidParameterError} from '../../util/errors';

export class InstrumentService {
  public static async ensureInstrumentExists(instrument: TdaInstrumentDto) {
    if (!instrument.assetType) {
      throw new InvalidParameterError('Cannot sync instrument without assetType: ' + JSON.stringify(instrument));
    }
    const existing = await Instrument.findOne({
      where: {
        symbol: instrument.symbol,
        type: instrument.assetType,
        deleted: false
      }
    });
    if (existing) {
      return existing;
    } else {
      return Instrument.create({
        type: instrument.assetType,
        symbol: instrument.symbol
      }).save();
    }
  }
}
