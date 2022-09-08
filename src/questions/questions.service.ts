import {HttpException, Inject, Injectable} from '@nestjs/common';
import {
    AddNewQuestionResponse, AllQuestions,
    DeleteQuestionResponse,
    GetAllQuestionsResponse,
    GetAnswerFeedbackResponse,
    GetOneQuestionResponse, GetOneQuizQuestionsResponse, OneQuizQuestions,
    UpdatedQuestionResponse,
} from "../interfaces/questions";
import {Questions} from "./questions.entity";
import {DataSource} from "typeorm";

@Injectable()
export class QuestionsService {

    constructor(
        @Inject(DataSource) private dataSource: DataSource,
    ) {
    }

    async getAllQuestions(): Promise<AllQuestions> {

        const totalQuestions = await this.dataSource
            .createQueryBuilder()
            .select('COUNT(questions.id)', 'count')
            .from(Questions, 'questions')
            .getCount();

        const allQuestions = await Questions.find();

        return {
            allQuestions,
            totalQuestions,
        }
    }

    async getOneQuizQuestions(questionCategory: string): Promise<OneQuizQuestions> {
        if (!await Questions.findOne({where: {questionCategory}})) {
            throw new HttpException(`The given question category: '${questionCategory}' doesn't exist!`, 404);
        }

        const totalQuestions = await this.dataSource
            .createQueryBuilder()
            .select('COUNT(questions.id)', 'count')
            .from(Questions, 'questions')
            .where('questionCategory = :questionCategory', {questionCategory})
            .getCount();

            const quizQuestions = await Questions.find({where: {questionCategory}});

            return {
                quizQuestions,
                totalQuestions,
            }
        }

    async findOneQuestion(id: number): Promise<GetOneQuestionResponse> {
        const oneQuestion = await Questions.findOne({where: {id}});
        if (!oneQuestion) {
            throw new HttpException(`Question with ID: '${id}' doesn't exist!`, 404);
        } else {
            return oneQuestion
        }
    }

    async add(): Promise<AddNewQuestionResponse> {

        const newQuestion = Questions.create({
            questionCategory: 'Synonyms01',
            question: 'Synonym of bald',
            a: 'gray',
            b: 'hairless',
            c: 'clever',
            d: 'strong',
            correct: 'b',
        })

       if (await Questions.findOne({where: {question: newQuestion.question}})
           &&
           await Questions.findOne({where: {questionCategory: newQuestion.questionCategory}})) {
           throw new HttpException('Question already exists! Please provide a new question.', 400);
       } else {
           await newQuestion.save();
           return newQuestion;
       }
    }

    async delete(id: number): Promise<DeleteQuestionResponse> {
        if (await Questions.findOne({where: {id}})) {
            await Questions.delete(id);
            return {
                isSuccessful: true,
                message: `Question with ID: '${id}' has been deleted.`
            }
        } else {
            // return {
            //     isSuccessful: false,
            //     message: `Question with ID: ${id} doesn't exist!`
            // }
            throw new HttpException(`Question with the given ID: '${id}' doesn't exist!`, 404);
        }
    }

    async getAnswerFeedback(id: number, answer: string): Promise<GetAnswerFeedbackResponse> {
        const result = await Questions.findOne({where: {id}});

        if (!result) {
            throw new HttpException(`Question with the given ID: '${id}' doesn't exist!`, 404);
        } else if (result.correct === answer) {
            return {
                isSuccessful: true,
                message: `Well done! Correct answer is '${answer}'.`
            }
        } else {
            return {
                isSuccessful: false,
                message: `Sorry! The answer '${answer}' is incorrect!`
            }
        }
    }

    async update(id: number): Promise<UpdatedQuestionResponse> {
        const questionToUpdate = await Questions.findOne({where: {id}});
        if (!questionToUpdate) {
            throw new HttpException(`Question with the given ID: '${id}' doesn't exist!`, 404);
        } else {
            await this.dataSource
                .createQueryBuilder()
                .update(Questions)
                .set({question: 'Synonym of bald', correct: 'b'})
                .where('id = :id', {id})
                .execute()
        }
        return {
            isSuccessful: true,
            message: `Question wit ID: '${id}' has been updated.`
        }
    }
}
