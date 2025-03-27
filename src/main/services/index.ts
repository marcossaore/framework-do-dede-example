import { JwtTokenGenerator } from "@/application/infra/JwtTokenGenerator";
import env from "../config/env";
import { drizzle } from "drizzle-orm/node-postgres";

const services: {name: string, classLoader: any, autoLoad: boolean}[] = []

services.push(
    {
        name: 'Orm',
        classLoader: drizzle(env.db.url!),
        autoLoad: false
    },
    {
        name: 'TokenGenerator',
        classLoader: new JwtTokenGenerator(env.config.secret!),
        autoLoad: false
    }
)

export default services