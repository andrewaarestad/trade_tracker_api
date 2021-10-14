import {Column, Entity, JoinColumn, ManyToOne, OneToOne} from 'typeorm';
import {DomainObject} from '../abstract/domain-object';
import {HistoricalData} from '../transient/historical-data';
import {PositionPerformanceClosed} from '../transient/position-performance-closed';
import {PositionPerformanceOpen} from '../transient/position-performance-open';
import {QuoteData} from '../transient/quote-data';
import {Instrument} from './instrument';
import {PositionSet} from './position-set';
import {User} from './user';

@Entity()
export class Position extends DomainObject {

  @Column() public entryTime!: Date;
  @Column() public exitTime?: Date;
  @Column() public entryQuantity!: number;
  @Column() public currentQuantity!: number;
  @Column() public entryPrice!: number;
  @Column() public exitPrice?: number;
  @Column() public plClose!: number;
  @Column() public entryValue!: number;
  @Column() public exitValue?: number;

  @Column() public userId!: number;
  @Column() public instrumentId!: number;
  @Column() public positionSetId!: number;
  @Column() public brokerageAccountId!: number;

  @Column() public rolledToId!: number;
  @Column() public rolledFromId!: number;

  @OneToOne(() => PositionSet) @JoinColumn({name: 'position_set_id'}) public positionSet?: PositionSet;

  @ManyToOne(() => User, user => user.positions) public user?: User;
  @ManyToOne(() => Instrument, i => i.positions) public instrument?: Instrument;

  public quoteData?: QuoteData;
  public historicalData?: HistoricalData;
  public performanceOpen?: PositionPerformanceOpen;
  public performanceClosed?: PositionPerformanceClosed;

  public get isOpen() {
    return !this.exitTime;
  }

}
