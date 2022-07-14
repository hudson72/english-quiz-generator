import {Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {
    DeleteUserResponse,
    GetAllUsersResponse,
    GetUserResponse,
    RegisterUserResponse,
    UpdatedUserResponse
} from "../interfaces/users";
import {UsersService} from "./users.service";
import {RegisterDto} from "./dto/register.dto";
import {AdminPasswordGuard} from "../guards/admin-password.guard";

@Controller('users')
export class UsersController {

    constructor(
        @Inject(UsersService) private usersService: UsersService,
    ) {
    }

    @Post('/register')
    register(
        @Body() newUser: RegisterDto,
    ): Promise<RegisterUserResponse>{
        return this.usersService.register(newUser);
    }

    @Get('/:userId')
    @UseGuards(AdminPasswordGuard)
    user(
        @Param('userId') userId: string
    ): Promise<GetUserResponse> {
        return this.usersService.getUser(userId)
    }

    @Get('/')
    @UseGuards(AdminPasswordGuard)
    allUsers(): Promise<GetAllUsersResponse> {
        return this.usersService.getAllUsers()
    }

    @Get('/quizzes/:userId')
    @UseGuards(AdminPasswordGuard)
    userAndQuizzes(
        @Param('userId') userId: string
    ): Promise<GetUserResponse> {
        return this.usersService.getUserAndQuizzes(userId)
    }

    @Get('/all/quizzes')
    @UseGuards(AdminPasswordGuard)
    allUsersAndQuizzes(): Promise<GetAllUsersResponse> {
        return this.usersService.getAllUsersAndQuizzes()
    }

    @Patch('/:id/:email')
    @UseGuards(AdminPasswordGuard)
    updateUser(
        @Param('id') id: string,
        @Param('email') email: string,
    ): Promise<UpdatedUserResponse> {
        return this.usersService.update(id, email)
    }

    @Delete('/:id')
    @UseGuards(AdminPasswordGuard)
    deleteUser(
        @Param('id') id: string,
    ): Promise<DeleteUserResponse> {
        return this.usersService.delete(id);
    }
}
