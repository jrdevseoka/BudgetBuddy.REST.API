import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'LINK' })
    Link: string
  @CreateDateColumn({ name: 'CREATION' })
    Creation: Date
  @UpdateDateColumn({ name: 'LASTUPDATE' })
    LastUpdate: string
  @Column({ name: 'SEQNO', default: 0, nullable: false })
    SeqNo: number
}
