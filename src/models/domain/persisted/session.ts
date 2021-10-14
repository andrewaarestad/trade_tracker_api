import {Column, Entity, ManyToOne} from 'typeorm';
import {SessionTypes} from '../../enums/session-types';
import {DomainObject} from '../abstract/domain-object';
import {User} from './user';

@Entity()
export class Session extends DomainObject {

  @Column()   public userId?: number;
  @Column()   public token!: string;
  @Column()   public expiresAt?: Date;
  @Column()   public type!: SessionTypes;

  @ManyToOne(() => User, user => user.sessions) public user?: User;

  public get isExpired() {
    return !this.expiresAt || this.expiresAt < new Date();
  }
}
