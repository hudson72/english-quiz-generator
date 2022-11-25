import {PartialType} from "@nestjs/mapped-types";
import {AddNewQuizDto} from "./add-new-quiz.dto";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class UpdateQuizDto extends PartialType(AddNewQuizDto) {
    @IsNotEmpty()
    @IsString()
    quizName: string;

    @IsNotEmpty()
    @IsNumber()
    totalQuestions: number;
}