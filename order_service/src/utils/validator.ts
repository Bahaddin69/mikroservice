import Ajv, { Schema } from "ajv";

const ajc = new Ajv();

export const ValidatorRequest = <T>(requestBody: unknown, schema: Schema) => {
    const validatedData = ajc.compile<T>(schema);

    if (validatedData(requestBody))
        return false;

    const errors = validatedData.errors?.map((err) => err.message);

    return errors && errors[0];
}
