import {BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {GetAllQuizzesByUserResponse, SingleQuiz, SingleQuizByUser} from "../interfaces/quizzes";
import {Users} from "../users/users.entity";

@Entity()
export class Quizzes extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quizName: string;

    @Column()
    totalQuestions: number;

    // @Column()
    // usersId: string;

    @ManyToOne(type => Users, entity => entity.quizzes)
    @JoinColumn()
    users: Users;
}