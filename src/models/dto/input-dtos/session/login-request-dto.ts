import {jsonMember, jsonObject} from 'typedjson';
import {Deserializers} from '../../../../util/deserializers';

@jsonObject
export class LoginRequestDto {

  @jsonMember({deserializer: Deserializers.customString({trim: true, lowercase: true, required: true})})   public email!: string;
  @jsonMember({isRequired: true})   public password!: string;

}
