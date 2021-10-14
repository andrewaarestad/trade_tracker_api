import {jsonMember, jsonObject} from 'typedjson';

@jsonObject
export class TdaTransactionFeesDto {
  @jsonMember({isRequired: true}) public rFee!: number;
  @jsonMember({isRequired: true}) public additionalFee!: number;
  @jsonMember({isRequired: true}) public cdscFee!: number;
  @jsonMember({isRequired: true}) public regFee!: number;
  @jsonMember({isRequired: true}) public otherCharges!: number;
  @jsonMember({isRequired: true}) public commission!: number;
  @jsonMember({isRequired: true}) public optRegFee!: number;
  @jsonMember({isRequired: true}) public secFee!: number;
}
