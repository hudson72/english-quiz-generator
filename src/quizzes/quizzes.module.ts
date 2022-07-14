import { Module } from '@nestjs/common';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Quizzes} from "./quizzes.entity";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [
    UsersModule,
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
