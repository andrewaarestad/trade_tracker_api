import {jsonMember} from 'typedjson';
import {PositionPerformanceClosedDto} from './position-performance-closed-dto';
import {PositionSetSimpleDto} from './position-set-simple-dto';

export class PositionSetClosedDto extends PositionSetSimpleDto {
  @jsonMember({isRequired: true}) public performanceClosed!: PositionPerformanceClosedDto;
}
