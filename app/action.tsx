'use server'

import { Pool } from 'pg'

import { z } from 'zod'


const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    // database: 'public',
    password: 'root',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

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

    let already_query = {
        // give the query a unique name
        text: 'SELECT short_url FROM public.urls WHERE long_url = $1',
        values: [url],
    }

    

    

    // If no custom url is provided, generate one
    if(custom == undefined || custom.length < 1) {
        console.log("no custom")
        const result = await pool.query(already_query)
        if(result.rows.length > 0) {
            console.log("already exists in db")
            return "https://url.gameup.dev/" + result.rows[0].short_url
        }
        else {
            let isUnique = false
            while(!isUnique) {
                custom = makeid(8)
                let validation_query = {
                    // give the query a unique name
                    text: 'SELECT * FROM public.urls WHERE short_url = $1',
                    values: [custom],
                }
                const result = await pool.query(validation_query)
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
        let validation_query = {
            // give the query a unique name
            text: 'SELECT * FROM public.urls WHERE short_url = $1',
            values: [custom],
        }
        const result = await pool.query(validation_query)
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

    let query = {
        // give the query a unique name
        text: 'INSERT INTO public.urls(long_url, short_url) VALUES($1, $2)',
        values: [url, custom],
    }
    
    const result = await pool.query(query)
    return "https://url.gameup.dev/" + custom
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