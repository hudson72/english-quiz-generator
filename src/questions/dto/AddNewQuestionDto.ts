import {IsNotEmpty, IsString, Length} from "class-validator";

export class AddNewQuestionDto {
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