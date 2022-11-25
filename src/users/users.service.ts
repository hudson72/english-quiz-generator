import {Inject, Injectable} from '@nestjs/common';
import {RegisterDto} from "./dto/register.dto";
import {
    DeleteUserResponse,
    GetAllUsersResponse,
    GetUserResponse,
    RegisterUserResponse,
    UpdatedUserResponse
} from "../interfaces/users";
import {Users} from "./users.entity";
import {DataSource} from "typeorm";
import {hashPass} from "../utils/hash-pass";

@Injectable()
export class UsersService {

    constructor(
        @Inject(DataSource) private dataSource: DataSource,
    ) {
    }
    //todo: instead of 'filter' fn below, check Nest's Serializer Interceptor to exclude pass from the return object
    filter(user: Users): RegisterUserResponse {
        const {id, email} = user;
        return {id, email};
    }

    async register(newUser: RegisterDto): Promise<RegisterUserResponse> {
        const user = new Users();
        user.email = newUser.email;
        user.passHash = hashPass(newUser.pass);

        if (await Users.findOne({where: {email: user.email}})) {
            return {
                isSuccessful: false,
                message: `Sorry, user with email: ${user.email} already exists!`
            }
        } else {

            await user.save();
            return this.filter(user);
        }
    };

    async getUser(id: string): Promise<GetUserResponse> {
        const userToGet = await Users.findOne({where: {id}});
        if (!userToGet) {
            return {
                isSuccessful: false,
                message: `User with ID: '${id}' doesn't exist!`
            }
        } else {
            return userToGet;
        }
    }

    async getAllUsers(): Promise<GetAllUsersResponse> {
        return await Users.find();
    }

    async getUserAndQuizzes(id: string): Promise<GetUserResponse> {
        const userToGet = await Users.findOne({where: {id}, relations: ['quizzes']});
        if (!userToGet) {
            return {
                isSuccessful: false,
                message: `User with ID: '${id}' doesn't exist!`
            }
        } else {
            return userToGet
        }
    }

    async getAllUsersAndQuizzes(): Promise<GetAllUsersResponse> {
        return await Users.find({relations: ['quizzes']});
    }

    async update(id: string, email: string): Promise<UpdatedUserResponse> {
        if (!await Users.findOne({where: {id}})) {
            return {
                isSuccessful: false,
                message: `Sorry, user with given ID: '${id}' doesn't exist!`,
            }
        } else if (await Users.findOne({where: {email}})) {
            return {
                isSuccessful: false,
                message: `Sorry, given email: '${email}' already exists. PLease provide a new email.`
            }
        } else {
            await Users.update(id, {email});
        }
        return {
            isSuccessful: true,
            message: `User with ID: '${id}' has been updated with new email: '${email}'.`,
        }
    }

    async delete(id: string): Promise<DeleteUserResponse> {
        const userToDelete = await Users.findOne({where: {id}});
        if (!userToDelete) {
            return {
                isSuccessful: false,
                message: `User with ID: '${id}' doesn't exist!`
            }
        } else {
            await Users.delete(id);
            return {
                isSuccessful: true,
                message: `User with ID: '${id}' has been deleted.`
            }
        }
    }
}
