import {jsonMember, jsonObject} from 'typedjson';
import {BaseDto} from './base-dto';

@jsonObject
export class UserDto extends BaseDto {
  @jsonMember public email!: string;
}
