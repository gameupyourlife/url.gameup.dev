"use server";

import { redirect } from 'next/navigation';
import { Pool } from 'pg'

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

export async function GET(request, { params }) {
    const slug = params.slug;
    const query = {
        // give the query a unique name
        name: 'get_long_url',
        text: 'SELECT long_url FROM public.urls WHERE short_url = $1',
        values: [slug],
    }
    
    const result = await pool.query(query)
    
    redirect(result.rows[0].long_url)
    return new Response(JSON.stringify(result.rows[0].long_url))
}