import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pdf } from '../../pdf/entities/pdf.entity';

@Entity('workflow')
export class Workflow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pdf)
  @JoinColumn()
  pdf: Pdf;

  @Column()
  role1Email: string;

  @Column({ nullable: true })
  role2Email: string;

  @Column({ nullable: true })
  role3Email: string;

  @Column({ default: 1 })
  currentRole: number;

  @Column({ default: 'Pending' })
  status: string;
}
