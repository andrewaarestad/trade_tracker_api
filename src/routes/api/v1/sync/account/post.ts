import {BrokerageSyncService} from '../../../../../services/load/brokerage-sync-service';
import {AuthenticatedUserController} from '../../../../classes/controller';

export class SyncAccountController extends AuthenticatedUserController {
  public async handleRequest() {
    await BrokerageSyncService.syncAllBrokerageAccounts(this.requestingUser.id);
  }
}
