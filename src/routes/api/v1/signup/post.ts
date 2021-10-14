import {CreateUserDto} from '../../../../models/dto/input-dtos/create-user-dto';
import {Mapper} from '../../../../models/dto/mapping/mapper';
import {UserDto} from '../../../../models/dto/output-dtos/user-dto';
import {UserService} from '../../../../services/load/user-service';
import {UserQueryService} from '../../../../services/query/user-query-service';
import {Controller} from '../../../classes/controller';

export class SignupUserController extends Controller {
  public async handleRequest() {
    const body = await Mapper.mapInput(this.request.body, CreateUserDto);
    const saved = await UserService.createUser(body);
    const loaded = await UserQueryService.getUser(saved.id);
    return Mapper.mapOutput(loaded, UserDto);
  }
}
