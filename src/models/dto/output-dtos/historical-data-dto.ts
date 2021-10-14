import {jsonMember, jsonObject} from 'typedjson';

@jsonObject
export class HistoricalDataDto {
  @jsonMember public todayOpen!: number;
}
