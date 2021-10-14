import {jsonMember, jsonObject} from 'typedjson';
import {Deserializers} from '../../../util/deserializers';
import {TdaTransactionFeesDto} from './tda-transaction-fees-dto';
import {TdaTransactionItemDto} from './tda-transaction-item-dto';

export enum TdaTransactionType {
  Trade = 'TRADE',
  ElectronicFund = 'ELECTRONIC_FUND',
  ReceiveAndDeliver = 'RECEIVE_AND_DELIVER',
  Journal = 'JOURNAL'

  /*
       "TRADE",
      "RECEIVE_AND_DELIVER",
      "DIVIDEND_OR_INTEREST",
      "ACH_RECEIPT",
      "ACH_DISBURSEMENT",
      "CASH_RECEIPT",
      "CASH_DISBURSEMENT",
      "ELECTRONIC_FUND",
      "WIRE_OUT",
      "WIRE_IN",
      "JOURNAL",
      "MEMORANDUM",
      "MARGIN_CALL",
      "MONEY_MARKET",
      "SMA_ADJUSTMENT"
   */
}

@jsonObject
export class TdaTransactionDto {
  @jsonMember({isRequired: true}) public type!: TdaTransactionType;

  @jsonMember({isRequired: true}) public subAccount!: string;
  @jsonMember public orderId?: string;
  @jsonMember public settlementDate?: string;
  @jsonMember public sma?: number;
  @jsonMember public requirementReallocationAmount?: number;
  @jsonMember public dayTradeBuyingPowerEffect?: number;
  @jsonMember({isRequired: true}) public netAmount!: number;
  @jsonMember({deserializer: Deserializers.date, isRequired: true}) public transactionDate!: Date;
  @jsonMember({deserializer: Deserializers.date}) public orderDate?: Date;
  @jsonMember public transactionId?: number;
  @jsonMember({isRequired: true}) public cashBalanceEffectFlag!: boolean;
  @jsonMember({isRequired: true}) public description!: string;
  @jsonMember({isRequired: true}) public fees!: TdaTransactionFeesDto;
  @jsonMember({isRequired: true}) public transactionItem!: TdaTransactionItemDto;

}
