import { BadRequest, Validation } from "framework-do-dede";
import { z, ZodError } from "zod";

export class LoginValidator implements Validation {
    validate(input: any) {
        try {            
            return z.object({
                email: z.string({
                    invalid_type_error: `O atributo "email" deve ser uma "string".`,
                    required_error: `O atributo "email" é obrigatório.`,
                }).email({ message: 'O atributo "email" está inválido.'}),
                password: z.string({
                    invalid_type_error: `O atributo "password" deve ser uma "string".`,
                    required_error: `O atributo "password" é obrigatório.`,
                })
            }).parse(input)
        } catch (error: any) {
            const zodError = error as ZodError
            const badRequestError =  zodError.errors[0].message
            throw new BadRequest(badRequestError)
        }
    }
}