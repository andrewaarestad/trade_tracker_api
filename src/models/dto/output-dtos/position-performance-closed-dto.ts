import {jsonMember, jsonObject} from 'typedjson';
import {Deserializers} from '../../../util/deserializers';

@jsonObject
export class PositionPerformanceClosedDto {
  @jsonMember({isRequired: true, deserializer: Deserializers.float(2)}) public realizedGainUsd!: number;
  @jsonMember({isRequired: true, deserializer: Deserializers.float(2)}) public realizedGainPercent!: number;
  @jsonMember({isRequired: true, deserializer: Deserializers.float(2)}) public realizedGainPercentAnnualized!: number;
  @jsonMember({isRequired: true, deserializer: Deserializers.float(2)}) public entryPrice!: number;
  @jsonMember({isRequired: true, deserializer: Deserializers.float(2)}) public entryValue!: number;
  @jsonMember({isRequired: true}) public entryQuantity!: number;
  @jsonMember({isRequired: true, deserializer: Deserializers.float(2)}) public exitPrice!: number;
  @jsonMember({isRequired: true, deserializer: Deserializers.float(2)}) public exitValue!: number;
}
