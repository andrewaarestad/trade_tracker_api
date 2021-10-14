

// All domain objects must be registered here...

import {BrokerageAccount} from './persisted/brokerage-account';
import {Instrument} from './persisted/instrument';
import {Position} from './persisted/position';
import {PositionSet} from './persisted/position-set';
import {Session} from './persisted/session';
import {Trade} from './persisted/trade';
import {User} from './persisted/user';

export class DomainObjectRegistry {
  public static allObjects() {
    return [
      BrokerageAccount,
      Instrument,
      Position,
      PositionSet,
      Session,
      Trade,
      User
    ];
  }
}
