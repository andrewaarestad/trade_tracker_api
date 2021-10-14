import {User} from '../../models/domain/persisted/user';

export class UserQueryService {

  public static async getUser(userId: number) {
    return User.findOne({
      where: {
        id: userId,
        deleted: false
      }
    });
  }

}
