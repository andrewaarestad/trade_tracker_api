import {Mapper} from '../../../../../../models/dto/mapping/mapper';
import {PositionSetOpenDto} from '../../../../../../models/dto/output-dtos/position-set-open-dto';
import {PositionSetQueryService} from '../../../../../../services/query/position-set-query-service';
import {AuthenticatedUserController} from '../../../../../classes/controller';

export class GetPositionSetQuoteDataController extends AuthenticatedUserController {
  public async handleRequest() {

    const positionSetId = this.parseNumericParam('position_set_id');
    const positionSet = await PositionSetQueryService.getPositionSetById(positionSetId);
    return Mapper.mapOutput(positionSet, PositionSetOpenDto);
  }
}
