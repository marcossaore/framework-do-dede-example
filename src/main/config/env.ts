const hasPort = (process.env.APP_PORT && process.env.APP_PORT !== '80')
export default {
    db: {
        url: process.env.DATABASE_URL,
    },
    app: {
        name: process.env.APP_NAME,
        port: process.env.APP_PORT ? Number(process.env.APP_PORT) : 80,
        url: hasPort ? `${process.env.APP_URL}:${process.env.APP_PORT}` : process.env.APP_URL
    },
    config: {
        secret: process.env.SECRET
    }
}