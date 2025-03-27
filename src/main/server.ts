import { Dede } from "framework-do-dede";
import repositories from "./repositories";
import '@/main/controllers';
import services from "./services";
import env from "./config/env";

Dede.init({
    framework: {
        use: 'elysia',
        port: env.app.port
    },
    registries: [
        ...services,
        ...repositories,
    ]
})
