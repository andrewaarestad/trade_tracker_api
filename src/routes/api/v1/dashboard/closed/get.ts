import {Mapper} from '../../../../../models/dto/mapping/mapper';
import {PositionSetSimpleDto} from '../../../../../models/dto/output-dtos/position-set-simple-dto';
import {PositionSetQueryService} from '../../../../../services/query/position-set-query-service';
import {AuthenticatedUserController} from '../../../../classes/controller';

export class GetClosedPositionsDashboard extends AuthenticatedUserController {
  public async handleRequest() {
    const positionSets = await PositionSetQueryService.getClosedPositionSets(this.requestingUser.id);
    // console.log('Loaded closed position sets: ' + positionSets.length);
    console.log(positionSets.map(p => p.performanceClosed?.realizedGainPercent));
    return Mapper.mapOutputArray(positionSets, PositionSetSimpleDto);
  }
}
