import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizzesModule } from './quizzes/quizzes.module';
import { QuestionsModule } from './questions/questions.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'english_quiz_generator',
      entities: ['dist/**/**.entity{.ts,.js}'],
      bigNumberStrings: false,
      logging: true,
      synchronize: true,
    }),
    QuizzesModule,
    QuestionsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
