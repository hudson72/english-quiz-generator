import {IsNotEmpty, IsString, Length} from "class-validator";
import {PartialType} from "@nestjs/mapped-types";
import {AddNewQuestionDto} from "./add-new-question.dto";

export class UpdateQuestionDto extends PartialType(AddNewQuestionDto) {
    @IsNotEmpty()
    @IsString()
    questionCategory: string;

    @IsNotEmpty()
    @IsString()
    question: string;

    @IsNotEmpty()
    @IsString()
    a: string;

    @IsNotEmpty()
    @IsString()
    b: string;

    @IsNotEmpty()
    @IsString()
    c: string;

    @IsNotEmpty()
    @IsString()
    d: string;

    @IsNotEmpty()
    @IsString()
    @Length(1,1)
    correct: string;
}