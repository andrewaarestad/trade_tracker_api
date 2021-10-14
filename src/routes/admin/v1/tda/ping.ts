import {TdaManager} from '../../../../managers/tda-manager';
import {BrokerageAccount} from '../../../../models/domain/persisted/brokerage-account';
import {AuthenticatedUserController} from '../../../classes/controller';

export class PingTdaController extends AuthenticatedUserController {
  public async handleRequest() {
    const accounts = await BrokerageAccount.find({
      where: {
        userId: this.requestingUser.id,
        deleted: false
      }
    });
    if (accounts.length > 0) {
      return TdaManager.getAccount(parseInt(accounts[0].accountId));
    } else {
      return 'No account to sync.';
    }
  }
}
