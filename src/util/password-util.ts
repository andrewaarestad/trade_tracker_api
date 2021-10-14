import Bcrypt = require('bcryptjs');


export class PasswordUtil {

  public static stripPasswordsFromObject(object: any) {
    Object.keys(object).forEach(key => {
      if (object[key] && object[key].constructor === Object) {
        object[key] = PasswordUtil.stripPasswordsFromObject(object[key]);
      } else if (key.toLowerCase().indexOf('password') !== -1) {
        object[key] = '********';
      }
    });
    return object;
  }

  public static hashSaltPassword(password: string): string {
    const salt = Bcrypt.genSaltSync(10);
    return Bcrypt.hashSync(password, salt);
  }

  public static verifyPassword(test: string, bcryptedPassword: string): Promise<boolean> {
    return Bcrypt.compare(test, bcryptedPassword);
  }

}
