import {jsonMember, jsonObject} from 'typedjson';
import {InstrumentType} from '../../enums/instrument-type';

@jsonObject
export class TdaInstrumentDto {
  @jsonMember public assetType?: InstrumentType;
  @jsonMember({isRequired: true}) public cusip!: string;
  @jsonMember({isRequired: true}) public symbol!: string;
  @jsonMember public description?: string;
}
