import {Column, Entity, OneToMany} from 'typeorm';
import {DomainObject} from '../abstract/domain-object';
import {BrokerageAccount} from './brokerage-account';
import {Position} from './position';
import {PositionSet} from './position-set';
import {Session} from './session';
import {Trade} from './trade';

@Entity()
export class User extends DomainObject {

  @Column() public email!: string;
  @Column() public password!: string;

  @OneToMany(() => Session, session => session.user, {persistence: false}) public sessions!: Array<Session>;
  @OneToMany(() => BrokerageAccount, b => b.user) public brokerageAccounts!: Array<BrokerageAccount>;
  @OneToMany(() => PositionSet, b => b.user) public positionSets!: Array<PositionSet>;
  @OneToMany(() => Position, b => b.user) public positions!: Array<Position>;
  @OneToMany(() => Trade, b => b.user) public trades!: Array<Trade>;

}
