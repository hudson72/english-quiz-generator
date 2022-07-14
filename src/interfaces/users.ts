export interface RegisterUser {
    id: string;
    email: string;
}

export type GetAllUsersResponse = RegisterUser[];

export type RegisterUserResponse = RegisterUser | {
    isSuccessful: false;
    message: string;
}

export type GetUserResponse = RegisterUser | {
    isSuccessful: false;
    message: string;
}

export type UpdatedUserResponse =  {
    isSuccessful: boolean;
    message: string;
}

export type DeleteUserResponse =  {
    isSuccessful: boolean;
    message: string;
}


