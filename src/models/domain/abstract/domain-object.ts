import {BaseEntity, Column, PrimaryGeneratedColumn} from 'typeorm';

export abstract class DomainObject extends BaseEntity {

  @PrimaryGeneratedColumn()  public id!: number;

  @Column() public deleted!: boolean;
  @Column() public updatedAt!: Date;
  @Column() public createdAt!: Date;

}
