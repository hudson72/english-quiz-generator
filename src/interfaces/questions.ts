export interface Question {
    questionCategory: string;
    question: string;
    a: string;
    b: string;
    c: string;
    d: string;
    correct: string;
}

export type GetAllQuestionsResponse = Question[];

export type GetOneQuizQuestionsResponse = Question[] | {
    isSuccessful: false,
    message: string,
};

export type AddNewQuestionResponse = Question | {
    isSuccessful: false;
    message: string;
}

export type GetOneQuestionResponse = Question | {
    isSuccessful: false;
    message: string;
}

export interface DeleteQuestionResponse {
    isSuccessful: boolean;
    message: string;
}

export interface GetAnswerFeedbackResponse {
    isSuccessful: boolean;
    message: string;
}

export type UpdatedQuestionResponse =  {
    isSuccessful: boolean;
    message: string;
}
