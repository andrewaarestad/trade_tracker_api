import {Column, Entity, ManyToOne, OneToMany} from 'typeorm';
import {PositionSetType} from '../../enums/position-set-type';
import {DomainObject} from '../abstract/domain-object';
import {PositionPerformanceClosed} from '../transient/position-performance-closed';
import {PositionPerformanceOpen} from '../transient/position-performance-open';
import {Instrument} from './instrument';
import {Position} from './position';
import {Trade} from './trade';
import {User} from './user';

@Entity()
export class PositionSet extends DomainObject {

  @Column() public type!: PositionSetType;
  @Column() public isOpen!: boolean;
  @Column() public brokerageAccountId!: number;
  @Column() public userId!: number;
  @Column() public underlyingInstrumentId!: number;
  @Column() public entryTime!: Date;
  @Column() public exitTime?: Date;

  @OneToMany(() => Trade, t => t.positionSet) public trades?: Array<Trade>;
  @OneToMany(() => Position, t => t.positionSet) public positions?: Array<Position>;

  @ManyToOne(() => User, user => user.positionSets) public user?: User;
  @ManyToOne(() => Instrument, i => i.positionSets) public underlyingInstrument?: Instrument;

  // public quoteData?: QuoteData;
  public performanceOpen?: PositionPerformanceOpen;
  public performanceClosed?: PositionPerformanceClosed;

}
