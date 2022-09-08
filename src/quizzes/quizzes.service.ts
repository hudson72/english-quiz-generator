import {HttpException, Inject, Injectable} from '@nestjs/common';
import {
    AddNewQuizResponse, AllQuizzesByUser,
    DeleteQuizResponse, GetAllQuizzesByUserResponse,
    GetAllQuizzesResponse, GetOneQuizResponse, UpdatedQuizResponse,
} from "../interfaces/quizzes";
import {Quizzes} from "./quizzes.entity";
import {DataSource} from "typeorm";
import {UsersService} from "../users/users.service";
import {Users} from "../users/users.entity";
import {AddNewQuizDto} from "./dto/AddNewQuizDto";

@Injectable()
export class QuizzesService {

    constructor(
        @Inject(DataSource) private dataSource: DataSource,
        @Inject(UsersService) private usersService: UsersService,
    ) {
    }

    filter(quiz: Quizzes): AddNewQuizResponse {
        const {quizName, totalQuestions} = quiz;
        return {quizName, totalQuestions};
    }

    async getAllQuizzes(): Promise<GetAllQuizzesResponse> {
        return await Quizzes.find();
    }

    async add(newQuiz: AddNewQuizDto, user: Users): Promise<AddNewQuizResponse> {

     const quiz = new Quizzes();
     quiz.quizName = newQuiz.quizName;
     quiz.totalQuestions = newQuiz.totalQuestions;

     if (newQuiz.quizName === 'undefined' || typeof newQuiz.quizName !== 'string') {
         throw new HttpException(`Please provide a 'quizName'! It must be a string!`, 400);
     } else if (newQuiz.totalQuestions <= 0 || typeof newQuiz.totalQuestions !== 'number' ) {
         throw new HttpException(`Please provide a 'totalQuestions'! It must be a number greater than 0!`, 400);
     }

        if (await Quizzes.findOne({where: {quizName: newQuiz.quizName}})) {
            throw new HttpException(`Sorry, quizName: '${newQuiz.quizName}' already exists! Please provide a new quizName.`, 400);
        } else {
            quiz.users = user;
            await quiz.save();

            return this.filter(quiz);
        }
    }

    async findOneQuiz(id: number): Promise<GetOneQuizResponse> {
        if (!await Quizzes.findOne({where: {id}})) {
            throw new HttpException(`Quiz with ID: '${id}' doesn't exist!`, 404);
        } else {
            return await Quizzes.findOne({where: {id}})
        }
    }

    async getAllQuizzesByUser(id: string): Promise<AllQuizzesByUser> {
        if (!await Users.findOne({where: {id}})) {
            throw new HttpException(`User with ID: '${id}' doesn't exist!`, 404);
        }

        const totalQuizzes = await this.dataSource
            .createQueryBuilder(Quizzes, 'quizzes')
            .leftJoin('quizzes.users', 'users')
            .where('users.id = :usersId', {usersId: id})
            .getCount()

        const quizzesByUser = await this.dataSource
            .createQueryBuilder(Quizzes, 'quizzes')
            .leftJoin('quizzes.users', 'users')
            .where('users.id = :usersId', {usersId: id})
            .getMany()

        return {
            quizzesByUser,
            totalQuizzes,
        }
    }

    async delete(id: number): Promise<DeleteQuizResponse> {

        if (await Quizzes.findOne({where: {id}})) {
            await Quizzes.delete(id);
            return {
                isSuccessful: true,
                message: `Quiz with ID: '${id}' has been deleted.`,
            }
        } else {
            throw new HttpException(`Sorry, quiz with ID: '${id}' doesn't exist!`, 404);
        }
    }
        async update(id: number, totalQuestions: number): Promise<UpdatedQuizResponse> {
            const quizToUpdate = await Quizzes.findOne({where: {id}});
            if (!quizToUpdate) {
                throw new HttpException(`Sorry, quiz with ID: '${id}' doesn't exist!`, 404);
            } else if (totalQuestions === quizToUpdate.totalQuestions) {
                throw new HttpException(`Sorry, the given 'totalQuestions' and the existing one are the same: '${totalQuestions}'!`, 400);
            } else {
                await Quizzes.update(id, {totalQuestions});
            }
            return {
                isSuccessful: true,
                message: `Quiz with ID: '${id}' has been updated with new 'totalQuestions': '${totalQuestions}'.`,
            }
        }
    }

