import {jsonMember, jsonObject} from 'typedjson';
import {Deserializers} from '../../../util/deserializers';

@jsonObject
export abstract class BaseDto {

  @jsonMember({isRequired: true}) public id!: number;
  // @jsonMember({isRequired: true}) public deleted!: boolean;
  @jsonMember({deserializer: Deserializers.date}) public createdAt!: Date;
  @jsonMember({deserializer: Deserializers.date}) public updatedAt!: Date;
}
