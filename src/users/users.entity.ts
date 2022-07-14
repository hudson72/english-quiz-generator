import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Quizzes} from "../quizzes/quizzes.entity";

@Entity()
export class Users extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 255,
    })
    email: string;

    @Column({select: false})
    passHash: string;

    @Column({
        nullable: true,
        default: null,
        select: false,
    })
    currTokenId: string | null;

    @OneToMany(type => Quizzes, entity => entity.users)
    quizzes: Quizzes[];
}