import {jsonMember, jsonObject} from 'typedjson';
import {Deserializers} from '../../../util/deserializers';

@jsonObject
export class QuoteDataDto {
  @jsonMember({deserializer: Deserializers.date}) public timestamp?: Date;
  @jsonMember public bid!: number;
  @jsonMember public ask!: number;
  @jsonMember public last!: number;
  @jsonMember public volume!: number;

}
