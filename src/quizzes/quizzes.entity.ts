import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../users/users.entity';

@Entity()
export class Quizzes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quizName: string;

  @Column()
  totalQuestions: number;

  @ManyToOne((type) => Users, (entity) => entity.quizzes)
  @JoinColumn()
  users: Users;
}
