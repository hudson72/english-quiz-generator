import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import {Questions} from "./questions.entity";
import {QuestionsService} from "./questions.service";
import {DataSource} from "typeorm";
import {getRepositoryToken} from "@nestjs/typeorm";

describe('QuestionsController', () => {
  let questionsController: QuestionsController;
  let questionsService: QuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [QuestionsService, {provide: getRepositoryToken(DataSource), useValue: Questions}],
    }).compile();

    questionsController = module.get<QuestionsController>(QuestionsController);
    questionsService = module.get<QuestionsService>(QuestionsService);
  });

  // it('should be defined', () => {
  //   expect(questionsController).toBeDefined();
  //   expect(questionsService).toBeDefined();
  // });

  describe('getAllQuestions', () => {
    it('should return an array of questions', async() => {
      const result = [];
      jest.spyOn(questionsService, 'getAllQuestions').mockRejectedValue(async () => result);
      expect(await questionsController.allQuestions()).toBe(result)
    })
  })
});

