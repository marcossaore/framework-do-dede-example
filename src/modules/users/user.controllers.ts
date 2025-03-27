import { Controller, Post, RequestData, Validator, UseCaseHandler, Get } from "framework-do-dede";
import { CreateUserValidator } from "./usecases/create/create-user.validator";
import { CreateUser } from "./usecases/create/create-user.usecase";
import { GetUser } from "./usecases/get/get-user.usecase";

@Controller('/users')
class UserController {
    @Post({ statusCode: 201 })
    @Validator(CreateUserValidator)
    create(input: CreateUser.Input, request: RequestData): CreateUser.Output {
        UseCaseHandler.load(CreateUser, request).execute(input)
    }

    @Get({ statusCode: 200, params: ['id'] })
    get(input: GetUser.Input, request: RequestData): GetUser.Output {
        return UseCaseHandler.load(GetUser, request).execute(input)
    }
}