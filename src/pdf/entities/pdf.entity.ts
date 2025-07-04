import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pdf')
export class Pdf {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  filePath: string;

  @Column({ default: 'uploaded' })
  status: string;
}
