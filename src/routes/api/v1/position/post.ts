import {CreatePositionDto} from '../../../../models/dto/input-dtos/create-position-dto';
import {Mapper} from '../../../../models/dto/mapping/mapper';
import {PositionDto} from '../../../../models/dto/output-dtos/position-dto';
import {PositionService} from '../../../../services/load/position-service';
import {AuthenticatedUserController} from '../../../classes/controller';

export class CreatePositionController extends AuthenticatedUserController {
  public async handleRequest() {
    const body = await Mapper.mapInput(this.request.body, CreatePositionDto);
    const saved = await PositionService.createPosition(this.requestingUser.id, body);
    return Mapper.mapOutput(saved, PositionDto);
  }
}
