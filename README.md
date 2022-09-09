# ENGLISH QUIZ GENERATOR
#### Application for creating quizzes by teachers of English

## Table of Contents
* [General Info](#general-info)
* [Technologies](#technologies)
* [Features](#features)
* [Setup](#setup)
* [Usage](#usage)
* [Project Status](#project-status)
* [Contact info](#contact-info)

## General Info
This is my final project for the online back-end course 'MegaK'. It gives me an opportunity to put the knowledge acquired during the course to the test.
The main aim of the app is to help teachers of English to create and share quizzes which can be used in lessons.

## Technologies
Project is created with:
* JavaScript ES6
* Node.js -  18.7.0
* Nest.js - 8.0.0
* TypeScript - 4.3.5
* TypeORM - 0.3.6
* MySQL - 2.3.3

## Features
### Current
Back-end part of the project includes:
* new user registration
* user authorisation
* creating and saving new quizzes and questions to database
* listing, updating and deleting existing quizzes and questions from database
* data validation

### Upcoming
#### Front-end
* user (teacher) interface
* user (student) interface
* HTML to PDF converter for quiz printing

## Setup
To clone & run this application, you'll need Git & Node.js installed on you PC.
From your command line:
```bash
# Clone this repository
$ git clone https://github.com/hudson72/english-quiz-generator
# Go to project directory
$ cd english_quiz_generator
# Install dependencies
$ npm install
# Run the app
$ nest start --watch
```
You will then be able to access it at localhost:3000. In order to create and save a new quiz you'll need MySQL database installed on your PC.

## Usage
As this is just a back-end part of the project, you can only test the app's end-points using one of the API clients like Insomnia or Postman. Please follow the steps in this document: [Usage info docs](./src/media/docs/usage_info.pdf) to get started (I'm using Insomnia in my presentation).

## Project Status
In progress

## Contact info
iiwanca@gmail.com



