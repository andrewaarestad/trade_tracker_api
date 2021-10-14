import {Column, Entity, JoinColumn, OneToMany, OneToOne} from 'typeorm';
import {InstrumentType} from '../../enums/instrument-type';
import {PutCall} from '../../enums/put-call';
import {DomainObject} from '../abstract/domain-object';
import {Position} from './position';
import {PositionSet} from './position-set';

@Entity()
export class Instrument extends DomainObject {

  @Column() public type!: InstrumentType;
  @Column() public symbol!: string;
  @Column() public expiration?: Date;
  @Column() public strike?: number;
  @Column() public putCall?: PutCall;
  @Column() public underlyingInstrumentId?: number;

  @OneToMany(() => PositionSet, b => b.underlyingInstrument) public positionSets!: Array<PositionSet>;
  @OneToMany(() => Position, b => b.instrument) public positions!: Array<Position>;

  @OneToOne(() => Instrument) @JoinColumn({name: 'underlying_instrument_id'}) public underlyingInstrument?: Instrument;

}
