import {HttpException, Inject, Injectable} from '@nestjs/common';
import {
    AddNewQuizResponse,
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
         return {
             isSuccessful: false,
             message: `Please provide a 'quizName'!. It must be a string!`
         }
     } else if (newQuiz.totalQuestions <= 0 || typeof newQuiz.totalQuestions !== 'number' ) {
         return {
             isSuccessful: false,
             message: `Please provide a 'totalQuestions'! It must be a number greater than 0!`
         }
     }

        if (await Quizzes.findOne({where: {quizName: newQuiz.quizName}})) {
            return {
                isSuccessful: false,
                message: `Sorry, quizName: '${newQuiz.quizName}' already exists! Please provide a new quizName.`,
            }
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

    async getAllQuizzesByUser(id: string): Promise<GetAllQuizzesByUserResponse> {
        if (!await Users.findOne({where: {id}})) {
            return {
                isSuccessful: false,
                message: `User with ID: '${id}' doesn't exist!`
            }
        }
        return await this.dataSource
            .createQueryBuilder(Quizzes, 'quizzes')
            .leftJoin('quizzes.users', 'users')
            .where('users.id = :usersId', {usersId: id})
            .execute()
    }

    async delete(id: number): Promise<DeleteQuizResponse> {

        if (await Quizzes.findOne({where: {id}})) {
            await Quizzes.delete(id);
            return {
                isSuccessful: true,
                message: `Quiz with ID: '${id}' has been deleted.`,
            }
        } else {
            return {
                isSuccessful: false,
                message: `Sorry, quiz with ID: '${id}' doesn't exist!`
            }
        }
    }
        async update(id: number, totalQuestions: number): Promise<UpdatedQuizResponse> {
            const quizToUpdate = await Quizzes.findOne({where: {id}});
            if (!quizToUpdate) {
                return {
                    isSuccessful: false,
                    message: `Sorry, quiz with ID: '${id}' doesn't exist.`
                }
            } else if (totalQuestions === quizToUpdate.totalQuestions) {
                return {
                    isSuccessful: false,
                    message: `The given 'totalQuestions' and the existing one are the same: '${totalQuestions}'!`,
                }
            } else {
                await Quizzes.update(id, {totalQuestions});
            }
            return {
                isSuccessful: true,
                message: `Quiz with ID: '${id}' has been updated with new 'totalQuestions': '${totalQuestions}'.`,
            }
        }
    }

