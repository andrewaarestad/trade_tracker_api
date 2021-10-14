import {jsonArrayMember, jsonMember, jsonObject} from 'typedjson';
import {Deserializers} from '../../../util/deserializers';
import {PositionSetType} from '../../enums/position-set-type';
import {BaseDto} from './base-dto';
import {InstrumentDto} from './instrument-dto';
import {PositionDto} from './position-dto';
import {PositionPerformanceClosedDto} from './position-performance-closed-dto';
import {PositionPerformanceOpenDto} from './position-performance-open-dto';
import {TradeDto} from './trade-dto';

@jsonObject
export class PositionSetSimpleDto extends BaseDto {
  @jsonMember({isRequired: true}) public type!: PositionSetType;
  @jsonArrayMember(PositionDto, {isRequired: true}) public positions!: Array<PositionDto>;
  @jsonArrayMember(TradeDto, {isRequired: true}) public trades!: Array<TradeDto>;
  @jsonMember({isRequired: true}) public underlyingInstrument!: InstrumentDto;
  @jsonMember({isRequired: true, deserializer: Deserializers.date}) public entryTime!: Date;
  @jsonMember({deserializer: Deserializers.date}) public exitTime?: Date;

  @jsonMember public performanceOpen?: PositionPerformanceOpenDto;
  @jsonMember public performanceClosed?: PositionPerformanceClosedDto;
}
