import { BadRequest, Validation } from "framework-do-dede";
import { z, ZodError } from "zod";

export class CreateUserValidator implements Validation {
    validate(input: any) {
        try {            
            return z.object({
                name: z.string({
                    invalid_type_error: `O atributo "name" deve ser uma "string".`,
                    required_error: `O atributo "name" é obrigatório.`,
                }),
                email: z.string({
                    invalid_type_error: `O atributo "email" deve ser uma "string".`,
                    required_error: `O atributo "email" é obrigatório.`,
                }).email({ message: 'O atributo "email" está inválido.'}),
                password: z.string({
                    invalid_type_error: `O atributo "password" deve ser uma "string".`,
                    required_error: `O atributo "password" é obrigatório.`,
                }),
                passwordConfirm: z.string({
                    invalid_type_error: `O atributo "passwordConfirm" deve ser uma "string".`,
                    required_error: `O atributo "passwordConfirm" é obrigatório.`,
                }),
            }).refine((data) => data.password.length >= 8, {
                message: "A senha deve ter no mínimo 8 caracters.",
                path: ["confirm"]
            }).refine((data) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(data.password), {
                message: "A senha deve ter no mínimo 8 caracteres: pelo menos 1 maiúscula, 1 minúscula, 1 número e 1 caracter especial.",
                path: ["confirm"]
            })
            .refine((data) => data.password === data.passwordConfirm, {
                message: "As senhas não conferem.",
                path: ["confirm"]
            })
            .parse(input)
        } catch (error: any) {
            const zodError = error as ZodError
            const badRequestError =  zodError.errors[0].message
            throw new BadRequest(badRequestError)
        }
    }
}