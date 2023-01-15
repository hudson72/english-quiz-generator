export interface SingleQuiz {
  quizName: string;
  totalQuestions: number;
}

export interface SingleQuizByUser {
  id: number;
  quizName: string;
  totalQuestions: number;
}

export interface AllQuizzesByUser {
  quizzesByUser: SingleQuizByUser[];
  totalQuizzes: number;
}

export type GetAllQuizzesByUserResponse =
  | SingleQuizByUser[]
  | {
      isSuccessful: false;
      message: string;
    };

export type GetAllQuizzesResponse = SingleQuiz[];

export type GetOneQuizResponse =
  | SingleQuiz
  | {
      isSuccessful: false;
      message: string;
    };

export type AddNewQuizResponse =
  | SingleQuiz
  | {
      isSuccessful: false;
      message: string;
    };

export interface DeleteQuizResponse {
  isSuccessful: boolean;
  message: string;
}

export type UpdatedQuizResponse = {
  isSuccessful: boolean;
  message: string;
};
