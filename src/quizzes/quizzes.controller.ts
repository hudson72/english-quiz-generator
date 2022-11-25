import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards
} from '@nestjs/common';
import {
    AddNewQuizResponse, AllQuizzesByUser,
    DeleteQuizResponse,
    GetAllQuizzesResponse, GetOneQuizResponse, UpdatedQuizResponse,
} from "../interfaces/quizzes";
import {QuizzesService} from "./quizzes.service";
import {AuthGuard} from "@nestjs/passport";
import {AddNewQuizDto} from "./dto/add-new-quiz.dto";
import {UserObj} from "../decorators/user-obj.decorator";
import {Users} from "../users/users.entity";
import {UpdateQuizDto} from "./dto/update-quiz.dto";

@Controller('quizzes')
export class QuizzesController {

    constructor(
       @Inject(QuizzesService) private quizzesService: QuizzesService,
    ) {
    };

    @Get('/:id')
    oneQuiz(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<GetOneQuizResponse> {
        return this.quizzesService.findOneQuiz(id);
    };

    @Get('/user/:id')
    allQuizzesByUser(
        @Param('id') id: string,
    ): Promise<AllQuizzesByUser> {
        return this.quizzesService.getAllQuizzesByUser(id);
    };

    @Get('/')
    allQuizzes(): Promise<GetAllQuizzesResponse> {
        return this.quizzesService.getAllQuizzes();
    };

    @Post('/')
    @UseGuards(AuthGuard('jwt'))
    addNewQuiz(
        @Body() newQuiz: AddNewQuizDto,
        @UserObj() user: Users,
    ): Promise<AddNewQuizResponse> {
        return this.quizzesService.add(newQuiz, user);
    };

    @Delete('/:id')
    @UseGuards(AuthGuard('jwt'))
    deleteQuiz(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<DeleteQuizResponse> {
        return this.quizzesService.delete(id);
    };

    @Patch('/:id')
    @UseGuards(AuthGuard('jwt'))
    updateQuiz(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateQuizDto: UpdateQuizDto
    ): Promise<UpdatedQuizResponse> {
        return this.quizzesService.update(id, updateQuizDto)
    };
}
