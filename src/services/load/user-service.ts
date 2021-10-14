import {User} from '../../models/domain/persisted/user';
import {CreateUserDto} from '../../models/dto/input-dtos/create-user-dto';
import {PasswordUtil} from '../../util/password-util';

export class UserService {
  public static async createUser(dto: CreateUserDto) {
    const unsaved = User.create(dto);
    unsaved.password = PasswordUtil.hashSaltPassword(unsaved.password);
    return unsaved.save();
  }
}
