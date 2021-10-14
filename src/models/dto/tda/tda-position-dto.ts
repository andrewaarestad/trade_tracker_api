import {jsonMember, jsonObject} from 'typedjson';
import {TdaInstrumentDto} from './tda-instrument-dto';

@jsonObject
export class TdaPositionDto {
  @jsonMember({isRequired: true}) public shortQuantity!: number;
  @jsonMember({isRequired: true}) public averagePrice!: number;
  @jsonMember({isRequired: true}) public currentDayProfitLoss!: number;
  @jsonMember({isRequired: true}) public currentDayProfitLossPercentage!: number;
  @jsonMember({isRequired: true}) public longQuantity!: number;
  @jsonMember({isRequired: true}) public settledLongQuantity!: number;
  @jsonMember({isRequired: true}) public settledShortQuantity!: number;
  @jsonMember({isRequired: true}) public instrument!: TdaInstrumentDto;
  @jsonMember({isRequired: true}) public marketValue!: number;
  @jsonMember({isRequired: true}) public maintenanceRequirement!: number;

}
