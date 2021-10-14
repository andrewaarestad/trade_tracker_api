import {jsonMember, jsonObject} from 'typedjson';
import {Deserializers} from '../../../util/deserializers';

@jsonObject
export class CreatePositionDto {
  @jsonMember({deserializer: Deserializers.date}) public entryTime!: Date;
  @jsonMember({deserializer: Deserializers.date}) public exitTime!: Date;
  @jsonMember public quantity!: number;
  @jsonMember public entryPrice!: number;
  @jsonMember public exitPrice!: number;

  @jsonMember public instrumentId!: number;
  @jsonMember public positionSetId!: number;
  @jsonMember public brokerageAccountId!: number;
}
