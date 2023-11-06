import {z} from 'zod'

//defining a schema, to make sure we always pass this data to the POST request body
export const SendMessageValidator = z.object({
    fileId: z.string(),
    message: z.string()
})