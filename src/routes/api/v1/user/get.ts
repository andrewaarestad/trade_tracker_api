import {Mapper} from '../../../../models/dto/mapping/mapper';
import {UserDto} from '../../../../models/dto/output-dtos/user-dto';
import {AuthenticatedUserController} from '../../../classes/controller';

export class GetLoggedInUserController extends AuthenticatedUserController {
  public async handleRequest() {
    return Mapper.mapOutput(this.requestingUser, UserDto);
  }
}
