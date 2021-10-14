import {LoginRequestDto} from '../../../../models/dto/input-dtos/session/login-request-dto';
import {Mapper} from '../../../../models/dto/mapping/mapper';
import {UserDto} from '../../../../models/dto/output-dtos/user-dto';
import {SessionService} from '../../../../services/load/session-service';
import {InternalServerError} from '../../../../util/errors';
import {Controller} from '../../../classes/controller';

export class LoginController extends Controller {
  public async handleRequest() {
    const body = await Mapper.mapInput(this.request.body, LoginRequestDto);
    const session = await SessionService.loginUser(this.request, body.email, body.password);
    if (!session.user) {
      throw new InternalServerError('Failed to load user for session.');
    }
    // Capture user and account on request for logging
    (this.request as any).user = session.user;
    return {
      token: session.token,
      user: await Mapper.mapOutput(session.user, UserDto),
    };
  }
}
