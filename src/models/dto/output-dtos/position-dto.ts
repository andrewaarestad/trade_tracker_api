import {jsonMember, jsonObject} from 'typedjson';
import {Deserializers} from '../../../util/deserializers';
import {BaseDto} from './base-dto';
import {HistoricalDataDto} from './historical-data-dto';
import {InstrumentDto} from './instrument-dto';
import {PositionPerformanceClosedDto} from './position-performance-closed-dto';
import {PositionPerformanceOpenDto} from './position-performance-open-dto';
import {QuoteDataDto} from './quote-data-dto';

@jsonObject
export class PositionDto extends BaseDto {

  @jsonMember({deserializer: Deserializers.date}) public entryTime!: Date;
  @jsonMember({deserializer: Deserializers.date}) public exitTime!: Date;
  @jsonMember({isRequired: true}) public entryQuantity!: number;
  @jsonMember({isRequired: true}) public currentQuantity!: number;
  @jsonMember({deserializer: Deserializers.float(2)}) public entryPrice!: number;
  @jsonMember public exitPrice!: number;

  @jsonMember public userId!: number;
  @jsonMember public instrumentId!: number;
  @jsonMember public positionSetId!: number;
  @jsonMember public brokerageAccountId!: number;

  @jsonMember({isRequired: true}) public instrument!: InstrumentDto;

  @jsonMember public quoteData?: QuoteDataDto;
  @jsonMember public historicalData?: HistoricalDataDto;
  @jsonMember public performanceOpen?: PositionPerformanceOpenDto;
  @jsonMember public performanceClosed?: PositionPerformanceClosedDto;
}
