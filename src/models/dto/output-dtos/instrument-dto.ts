import {jsonMember, jsonObject} from 'typedjson';
import {InstrumentType} from '../../enums/instrument-type';
import {PutCall} from '../../enums/put-call';

@jsonObject
export class InstrumentDto {

  @jsonMember public type!: InstrumentType;
  @jsonMember public symbol!: string;
  @jsonMember public expiration?: Date;
  @jsonMember public strike?: number;
  @jsonMember public putCall?: PutCall;

  @jsonMember public underlyingInstrument?: InstrumentDto;
}
