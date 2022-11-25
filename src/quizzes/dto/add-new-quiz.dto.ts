import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class AddNewQuizDto {
    @IsNotEmpty()
    @IsString()
    quizName: string;

    @IsNotEmpty()
    @IsNumber()
    totalQuestions: number;
}