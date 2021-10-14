import {Mapper} from '../models/dto/mapping/mapper';
import {TdaTransactionDto} from '../models/dto/tda/tda-transaction-dto';

const tdaclient = require('tda-api-client');


export class TdaManager {
  public static async getAccount(accountId: number) {
    // console.log('getting tda transactions');
    // const result = await tdaclient.transactions.getTransactions({
    //   accountId
    // });
    //
    // console.log('Got TDA transactions: ' + JSON.stringify(result, null, 2));

    try {

      const account = await tdaclient.accounts.getAccount({
        accountId,
        fields: 'positions'
      });

      console.log('Account details: ' + JSON.stringify(account, null, 2));
    } catch (err) {
      console.log('Error in TDA API: ', err);
      console.log(err.constructor.name);
      throw err;
    }
  }

  public static async getTransactions(accountId: number) {
    // console.log('getting tda transactions');
    const result = await tdaclient.transactions.getTransactions({
      accountId
    });

    // console.log('got transactions: ', result);

    return Mapper.mapInputArray(result, TdaTransactionDto);
  }
}
