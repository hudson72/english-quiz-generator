import {HttpException, Inject, Injectable} from '@nestjs/common';
import {
    AddNewQuestionResponse, AllQuestions,
    DeleteQuestionResponse,
    GetAnswerFeedbackResponse,
    GetOneQuestionResponse, OneQuizQuestions,
    UpdatedQuestionResponse,
} from "../interfaces/questions";
import {Questions} from "./questions.entity";
import {DataSource} from "typeorm";
import {AddNewQuestionDto} from "./dto/add-new-question.dto";

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

    async add(newQuestion: AddNewQuestionDto): Promise<AddNewQuestionResponse> {

        const newQuestionObj = new Questions();
        const { questionCategory, question, a, b, c, d, correct } = newQuestion;

        newQuestionObj.questionCategory = questionCategory;
        newQuestionObj.question = question;
        newQuestionObj.a = a;
        newQuestionObj.b = b;
        newQuestionObj.c = c;
        newQuestionObj.d = d;
        newQuestionObj.correct = correct;

       if (await Questions.findOne({where: {question: newQuestionObj.question}})
           &&
           await Questions.findOne({where: {questionCategory: newQuestionObj.questionCategory}})) {
           throw new HttpException('Question already exists! Please provide a new question.', 400);
       } else {
           await newQuestionObj.save();
           return newQuestionObj;
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
