import {Column, Entity, ManyToOne} from 'typeorm';
import {DomainObject} from '../abstract/domain-object';
import {User} from './user';

@Entity()
export class BrokerageAccount extends DomainObject {

  @Column() public name!: string;
  @Column() public accountId!: string;
  @Column() public userId!: number;


  @ManyToOne(() => User, user => user.brokerageAccounts) public user?: User;

}
