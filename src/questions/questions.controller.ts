import {Controller, Delete, Get, HttpStatus, Inject, Param, ParseIntPipe, Patch, Post, UseGuards} from '@nestjs/common';
import {
    AddNewQuestionResponse,
    DeleteQuestionResponse,
    GetAllQuestionsResponse,
    GetAnswerFeedbackResponse,
    GetOneQuestionResponse, GetOneQuizQuestionsResponse,
    UpdatedQuestionResponse,
} from "../interfaces/questions";
import {QuestionsService} from "./questions.service";
import {DataSource} from "typeorm";
import {AuthGuard} from "@nestjs/passport";

@Controller('questions')
export class QuestionsController {

    constructor(
        @Inject(QuestionsService) private questionsService: QuestionsService,
        @Inject(DataSource) private dataSource: DataSource,
    ) {
    }

    @Get('/')
    allQuestions(): Promise<GetAllQuestionsResponse> {
        return this.questionsService.getAllQuestions();
    }

    @Get('/:id')
    oneQuestion(
        @Param('id', new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.FORBIDDEN,
        })) id: number,
    ): Promise<GetOneQuestionResponse> {
        return this.questionsService.findOneQuestion(id);
    }

    @Get('/category/:category')
    questionsByCategory(
        @Param ('category') category: string,
        ): Promise<GetOneQuizQuestionsResponse> {
        return this.questionsService.getOneQuizQuestions(category);
    }

    @Post('/')
    @UseGuards(AuthGuard('jwt'))
    addNewQuestion(
    ): Promise<AddNewQuestionResponse> {
        return this.questionsService.add();
    }

    @Delete('/:id')
    @UseGuards(AuthGuard('jwt'))
    deleteQuestion(
        @Param('id',  new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.FORBIDDEN,
        })) id: number,
    ): Promise<DeleteQuestionResponse> {
        return this.questionsService.delete(id);
    }

    @Get('/answer/:id/:answer')
    answerFeedback(
        @Param ('id') id: number,
        @Param ('answer') answer: string,
    ): Promise<GetAnswerFeedbackResponse> {
        return this.questionsService.getAnswerFeedback(id, answer);
    }

    @Patch('/update/:id')
    @UseGuards(AuthGuard('jwt'))
    updateQuestion(
        @Param('id', new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.FORBIDDEN,
        })) id: number,
    ): Promise<UpdatedQuestionResponse> {
        return this.questionsService.update(id);
    }
}
