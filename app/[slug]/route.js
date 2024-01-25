"use server";

import { redirect } from 'next/navigation';
import { sql } from "@vercel/postgres";


export async function GET(request, { params }) {
    const slug = params.slug;

    const { rows } = await sql`SELECT long_url FROM public.urls WHERE short_url=${slug}`;
    
    redirect(rows[0].long_url)
    return new Response(JSON.stringify(rows[0].long_url))
}