import {Inject, Injectable} from '@nestjs/common';
import {
    AddNewQuestionResponse,
    DeleteQuestionResponse,
    GetAllQuestionsResponse,
    GetAnswerFeedbackResponse,
    GetOneQuestionResponse, GetOneQuizQuestionsResponse,
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

    async getAllQuestions(): Promise<GetAllQuestionsResponse> {

        const count = await this.dataSource
            .createQueryBuilder()
            .select('COUNT(questions.id)', 'count')
            .from(Questions, 'questions')
            .getRawOne();

        console.log(count);

        return await Questions.find();
    }

    async getOneQuizQuestions(questionCategory: string): Promise<GetOneQuizQuestionsResponse> {
        if (!await Questions.findOne({where: {questionCategory}})) {
            return {
                isSuccessful: false,
                message: `The given questionCategory: '${questionCategory}' doesn't exist!`
            }
        }
            return await Questions.find({where: {questionCategory}})
        }

    async findOneQuestion(id: number): Promise<GetOneQuestionResponse> {
        const oneQuestion = await Questions.findOne({where: {id}});
        if (!oneQuestion) {
            return {
                isSuccessful: false,
                message: `Question with ID: '${id}' doesn't exist!`
            }
        } else {
            return oneQuestion
        }
    }

    async add(): Promise<AddNewQuestionResponse> {

        const newQuestion = Questions.create({
            questionCategory: 'Synonyms',
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
           return {
               isSuccessful: false,
               message: 'Question already exists! Please provide a new question.',
           }
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
                message: `Question with ID: ${id} has been deleted.`
            }
        } else {
            return {
                isSuccessful: false,
                message: `Question with ID: ${id} doesn't exist!`
            }
        }
    }

    async getAnswerFeedback(id: number, answer: string): Promise<GetAnswerFeedbackResponse> {
        const result = await Questions.findOneOrFail({where: {id}});
        if (result.correct === answer) {
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
            return {
                isSuccessful: false,
                message: `Sorry, question with ID: '${id}' doesn't exist!.`
            }
        } else {
            await this.dataSource
                .createQueryBuilder()
                .update(Questions)
                .set({question: 'Synonym of bold', c: 'brave', correct: 'c'})
                .where('id = :id', {id})
                .execute()
        }

        return {
            isSuccessful: true,
            message: `Question wit ID: '${id}' has been updated.`
        }
    }
}
