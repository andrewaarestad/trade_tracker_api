import {jsonMember, jsonObject} from 'typedjson';
import {TdaInstrumentDto} from './tda-instrument-dto';

@jsonObject
export class TdaTransactionItemDto {
  @jsonMember public amount?: number;
  @jsonMember public price?: number;

  @jsonMember public cost?: number;
  @jsonMember public instruction?: string;
  @jsonMember public positionEffect?: string;
  @jsonMember public instrument?: TdaInstrumentDto;

}
