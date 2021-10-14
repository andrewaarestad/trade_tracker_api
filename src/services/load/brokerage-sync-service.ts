import {PromiseQueue} from 'hc-utilities';
import {getManager, EntityManager} from 'typeorm';
import {TdaManager} from '../../managers/tda-manager';
import {BrokerageAccount} from '../../models/domain/persisted/brokerage-account';
import {Trade} from '../../models/domain/persisted/trade';
import {TdaTransactionDto, TdaTransactionType} from '../../models/dto/tda/tda-transaction-dto';
import {InvalidParameterError} from '../../util/errors';
import {InstrumentService} from './instrument-service';
import {PositionService} from './position-service';
import {TradeService} from './trade-service';

export class BrokerageSyncService {

  public static async syncAllBrokerageAccounts(userId: number) {
    const accounts = await BrokerageAccount.find({
      where: {
        userId,
        deleted: false
      }
    });
    return new PromiseQueue(1).runAll(accounts.map(a => () => this.syncAccount(a)));
  }

  public static async syncAccount(account: BrokerageAccount) {
    // const result = await TradierManager.getAccount();

    // account.accountId = (454089723).toString();

    console.log('Syncing account: ', account.name + ': ' + account.accountId);

    const transactions = await TdaManager.getTransactions(parseInt(account.accountId));

    console.log('Pulled ' + transactions.length + ' transactions from TDA');

    // console.log('transactions: ', transactions);

    const orders = this.buildOrders(transactions);


    const sorted = orders.sort((a, b) => a[0].transactionDate.getTime() - b[0].transactionDate.getTime());

    // const cutoff = [sorted[0], sorted[1]];

    console.log('Built sorted orders: ', sorted.length);

    await new PromiseQueue(1).runAll(sorted.map(order => () => {
      return getManager().transaction(tx => {
        return this.syncOrder(tx, order, account);
      });
    }));
  }

  private static buildOrders(transactions: Array<TdaTransactionDto>) {
    const orders: {[key: string]: Array<TdaTransactionDto>} = {};
    transactions.forEach(transaction => {
      if (!transaction.orderId) {
        return;
      }
      const orderParts = transaction.orderId.split('.');
      const orderNumber = orderParts[0];
      orders[orderNumber] = orders[orderNumber] || [];
      orders[orderNumber].push(transaction);
    });
    return Object.values(orders);
  }

  private static async syncOrder(tx: EntityManager, order: Array<TdaTransactionDto>, account: BrokerageAccount) {

    console.log('');
    console.log('---------------------------');
    console.log('syncOrder: ', order.length + ' trades');
    order.forEach(trade => {
      console.log(' - trade ', trade.orderId, ': ', trade.transactionItem.instruction, trade.transactionItem.amount, trade.transactionItem.instrument?.symbol);
    });

    const orderTrades = await Promise.all(order.map(item => this.buildUnsavedTrade(item, account.userId, account.id)));

    let allBuilt = true;
    orderTrades.forEach(trade => {
      if (!trade) {
        allBuilt = false;
      }
    });
    if (!allBuilt) {
      console.log('Skipping order, failed to build one or more trades');
      return;
    }

    const goodOrder: Array<Trade> = orderTrades as Array<Trade>;

    console.log('Ready to save trades');

    let allTradesAlreadySynced = true;

    const savedTrades = await new PromiseQueue(1).runAll(goodOrder.map(trade => async() => {

      const existing = await Trade.find({where: {externalId: trade.externalId, deleted: false}});

      console.log('Found existing: ', existing.length > 0);

      if (existing.length === 0) {

        allTradesAlreadySynced = false;

        console.log('Syncing trade: orderId: ' + trade.orderId + ' - value: ' + trade.value);

        return TradeService.saveNewTrade(tx, trade);

      } else {
        console.log('Trade ' + trade.externalId + ' already synced: ' + (trade.quantity >= 0 ? ' ' : '') + trade.quantity + ' ' + ', orderId: ' + trade.orderId);
        return existing[0];
      }

    }));

    if (allTradesAlreadySynced) {
      console.log('allTradesAlreadySynced, done with this order.');
    } else {

      console.log('Saved ' + savedTrades.length + ' trades, building position now');

      await PositionService.buildPositionFromOrderTrades(tx, savedTrades);
    }


  }

  private static async buildUnsavedTrade(transaction: TdaTransactionDto, userId: number, accountId: number) {
    if (transaction.type === TdaTransactionType.ReceiveAndDeliver ||
      transaction.type === TdaTransactionType.ElectronicFund ||
      transaction.type === TdaTransactionType.Journal) {
      // silent skip
      return;
    }
    if (!transaction.orderId) {
      console.log('Warning, skipping transaction without order ID: ' + transaction.type);
      return;
    }
    if (!transaction.transactionItem.instrument) {
      throw new InvalidParameterError('Cannot sync transaction without instrument: ' + JSON.stringify(transaction));
    }
    if (!transaction.transactionItem.amount) {
      throw new InvalidParameterError('Cannot sync transaction without amount: ' + JSON.stringify(transaction));
    }
    if (!transaction.transactionItem.price) {
      throw new InvalidParameterError('Cannot sync transaction without price: ' + JSON.stringify(transaction));
    }
    if (!transaction.transactionItem.cost) {
      throw new InvalidParameterError('Cannot sync transaction without cost: ' + JSON.stringify(transaction));
    }

    if (!transaction.transactionId) {
      console.log('Transaction with orderId: ' + transaction.orderId + ' did not have a transactionId, it must not yet be settled...?');
      return;
    }

    const instrument = await InstrumentService.ensureInstrumentExists(transaction.transactionItem.instrument);
    const quantity = transaction.transactionItem.instruction === 'BUY' ? transaction.transactionItem.amount : -transaction.transactionItem.amount;

    return Trade.create({
      executionTime: transaction.transactionDate,
      quantity,
      price: transaction.transactionItem.price,
      value: transaction.transactionItem.cost,
      userId,
      instrumentId: instrument.id,
      // positionId,
      // positionSetId,
      brokerageAccountId: accountId,
      externalId: transaction.transactionId.toString(),
      orderId: transaction.orderId,
      sourceJson: transaction
    });
  }
}
