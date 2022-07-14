import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Question} from "../interfaces/questions";

@Entity()
export class Questions extends BaseEntity implements Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    questionCategory: string;

    @Column()
    question: string;

    @Column()
    a: string;

    @Column()
    b: string;

    @Column()
    c: string;

    @Column()
    d: string;

    @Column({
        length: 2,
    })
    correct: string;
}