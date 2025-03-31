import { RequestData, RequestMetrics, RequestMetricsHandler } from "framework-do-dede"

export class LogMetricsHandler implements RequestMetricsHandler {
    async handle(metrics: RequestMetrics, request: RequestData): Promise<void> {
        // save in db
    }
}