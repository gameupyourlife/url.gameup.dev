'use server'

import { sql } from "@vercel/postgres";
import { z } from 'zod'



const schema = z.object({
    url: z.string().includes(".", {
        message: "Invalid URL"
    }).min(2, {
        message: "Invalid URL",
    }),
    custom: z
    .union([z.string().length(0), z.string().min(6, {message: "Custom URL must be at least 6 characters long"}).max(20, {message: "Custom URL must be at most 20 characters long"})])
    .optional()
    .transform(e => e === "" ? undefined : e),
})

export async function shortenUrl(formData: FormData) {
    console.log("shortenUrl")
    const validatedFields = schema.parse({
        url: formData.get('url'),
        custom: formData.get('custom'),
    })

   

    let custom = validatedFields.custom
    let url = validatedFields.url

 

    

    // If no custom url is provided, generate one
    if(custom == undefined || custom.length < 1) {
        console.log("no custom")
        const result = await sql`SELECT short_url FROM public.urls WHERE long_url=${url}`;

        if(result.rows.length > 0) {
            console.log("already exists in db")
            return "url.gameup.dev/" + result.rows[0].short_url
        }
        else {
            let isUnique = false
            while(!isUnique) {
                custom = makeid(8)
                const result = await sql`SELECT * FROM public.urls WHERE short_url=${custom}`;

                if(result.rows.length < 1) {
                    isUnique = true
                }
            }
            console.log("new custom: " + custom)
        }
    }
    else {
        console.log("custom")
        let isUnique = false
        const result = await sql`SELECT * FROM public.urls WHERE short_url=${custom}`;

        if(result.rows.length < 1) {
            isUnique = true
        }

        if(!isUnique) {
            return {
                errors: {
                    custom: "Custom URL is already taken",
                }
            }
        }
    }

    
    const result = await sql`INSERT INTO public.urls(long_url, short_url) VALUES(${url}, ${custom})`;

    return "url.gameup.dev/" + custom
}


function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}