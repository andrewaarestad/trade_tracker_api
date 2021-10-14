import {Mapper} from '../../../../../models/dto/mapping/mapper';
import {PositionSetSimpleDto} from '../../../../../models/dto/output-dtos/position-set-simple-dto';
import {PositionSetQueryService} from '../../../../../services/query/position-set-query-service';
import {AuthenticatedUserController} from '../../../../classes/controller';

export class GetOpenPositionsDashboard extends AuthenticatedUserController {
  public async handleRequest() {
    const positionSets = await PositionSetQueryService.getOpenPositionSets(this.requestingUser.id, true);
    console.log('Loaded open position sets: ' + positionSets.length);
    return Mapper.mapOutputArray(positionSets, PositionSetSimpleDto);
  }
}
