import {jsonMember, jsonObject} from 'typedjson';

@jsonObject
export class CreateUserDto {
  @jsonMember({isRequired: true}) public email!: string;
  @jsonMember({isRequired: true}) public password!: string;
}
