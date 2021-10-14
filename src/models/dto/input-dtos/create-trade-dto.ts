import {jsonMember, jsonObject} from 'typedjson';
import {Deserializers} from '../../../util/deserializers';


@jsonObject
export class CreateTradeDto {

  @jsonMember({deserializer: Deserializers.date}) public executionTime!: Date;
  @jsonMember public quantity!: number;
  @jsonMember public price!: number;

  @jsonMember public instrumentId!: number;
  @jsonMember public positionId!: number;
  @jsonMember public positionSetId!: number;
  @jsonMember public brokerageAccountId!: number;
}
