import {jsonMember, jsonObject} from 'typedjson';
import {PositionPerformanceOpenDto} from './position-performance-open-dto';
import {PositionSetSimpleDto} from './position-set-simple-dto';

@jsonObject
export class PositionSetOpenDto extends PositionSetSimpleDto {
  @jsonMember({isRequired: true}) public performanceOpen!: PositionPerformanceOpenDto;
}
