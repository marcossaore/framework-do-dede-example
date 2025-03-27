import { CatRepository } from "@/modules/cats/cat.repository";
import { UserRepository } from "@/modules/users/user.repository";

const repositories: {name: string, classLoader: any, autoLoad: boolean}[] = []

repositories.push(
    {
        name: 'UserRepository',
        classLoader: UserRepository,
        autoLoad: true
    },
    {
        name: 'CatRepository',
        classLoader: CatRepository,
        autoLoad: true
    }
)

export default repositories