import { Controller, Post, type RequestData, Validator, UseCaseHandler, Get, Middleware, HttpServerError, Metrics, RequestMetricsHandler, RequestMetrics } from "framework-do-dede";
import { CreateCatValidator } from "./usecases/create-cat.validator";
import { CreateCat } from "./usecases/create-cat.usecase";
import { Authentication } from "@/application/middlewares/Authentication";
import { LogMetricsHandler } from "@/application/metrics/LogMetricsHandler";

@Controller('/cats')
class CatController {
    @Post({ statusCode: 201 })
    @Validator(CreateCatValidator)
    @Middleware(Authentication)
    @Metrics(LogMetricsHandler)
    create(input: CreateCat.Input, request: RequestData): Promise<CreateCat.Output | HttpServerError> {
        return UseCaseHandler.load(CreateCat, request).execute(input)
    }
}