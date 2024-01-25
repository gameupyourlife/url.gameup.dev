"use server";

import { redirect } from 'next/navigation';
import { sql } from "@vercel/postgres";


export async function GET(request, { params }) {
    const slug = params.slug;

    const { rows } = await sql`SELECT long_url FROM public.urls WHERE short_url=${slug}`;
    
    if (rows.length === 0) {
        return new Response("Not found", { status: 404 })
    }

    if (rows[0].long_url.startsWith("http")) {
        redirect(rows[0].long_url)
    } else {
        redirect("http://" + rows[0].long_url)
    }

    // redirect(rows[0].long_url)
    return new Response(JSON.stringify(rows[0].long_url))
}