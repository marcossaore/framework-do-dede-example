import { BadRequest, Validation } from "framework-do-dede";
import { z, ZodError } from "zod";

export class CreateCatValidator implements Validation {
    validate(input: any) {
        try {            
            return z.object({
                name: z.string({
                    invalid_type_error: `O atributo "name" deve ser uma "string".`,
                    required_error: `O atributo "name" é obrigatório.`,
                }),
            })
            .parse(input)
        } catch (error: any) {
            const zodError = error as ZodError
            const badRequestError =  zodError.errors[0].message
            throw new BadRequest(badRequestError)
        }
    }
}