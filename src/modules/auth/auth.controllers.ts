import { Controller, Post, RequestData, Validator, UseCaseHandler } from "framework-do-dede";
import { LoginValidator } from "./usecases/login/login.validator";
import { Login } from "./usecases/login/login-usecase";

@Controller('/auth')
class AuthController {
    @Post()
    @Validator(LoginValidator)
    async login(input: Login.Input, request: RequestData): Promise<Login.Output> {
        return UseCaseHandler.load(Login, request).execute(input)
    }
}