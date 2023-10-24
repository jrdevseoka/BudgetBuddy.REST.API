/* eslint-disable indent */
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IDataModel } from './data.interface'
export abstract class DataModelBase implements IDataModel {
  @PrimaryGeneratedColumn()
  Link: string
  @CreateDateColumn()
  Creation: Date
  LUserUpdate: string
  @UpdateDateColumn()
  LastUpdate: string
  SeqNo: string
}
