import {Column, Entity, JoinColumn, ManyToOne, OneToOne} from 'typeorm';
import {DomainObject} from '../abstract/domain-object';
import {PositionSet} from './position-set';
import {User} from './user';

@Entity()
export class Trade extends DomainObject {

  @Column() public executionTime!: Date;
  @Column() public quantity!: number;
  @Column() public price!: number;
  @Column() public value!: number;

  @Column() public userId!: number;
  @Column() public instrumentId!: number;
  @Column() public positionId?: number;
  @Column() public positionSetId?: number;
  @Column() public brokerageAccountId!: number;

  @Column() public externalId?: string;
  @Column() public orderId?: string;

  @Column({type: 'json'}) public sourceJson!: any;

  @OneToOne(() => PositionSet) @JoinColumn({name: 'position_set_id'}) public positionSet?: PositionSet;
  @ManyToOne(() => User, user => user.trades) public user?: User;

}
