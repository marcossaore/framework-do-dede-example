import { Controller, Post, RequestData, Validator, UseCaseHandler, Get, Middleware } from "framework-do-dede";
import { CreateCatValidator } from "./usecases/create-cat.validator";
import { CreateCat } from "./usecases/create-cat.usecase";
import { Authentication } from "@/application/middlewares/Authentication";

@Controller('/cats')
class CatController {
    @Post({ statusCode: 201 })
    @Validator(CreateCatValidator)
    @Middleware(Authentication)
    create(input: CreateCat.Input, request: RequestData): CreateCat.Output {
        UseCaseHandler.load(CreateCat, request).execute(input)
    }
}