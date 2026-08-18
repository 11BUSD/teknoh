import { NextResponse } from "next/server";
import { z } from "zod";

const RequestSchema = z.object({ offer:z.string().min(3).max(800), buyer:z.string().min(2).max(400), geography:z.string().min(2).max(200), price:z.string().max(120).optional().default(""), problems:z.string().min(3).max(1200) });

export async function POST(request: Request) {
  const parsed = RequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({error:"Invalid request."},{status:400});
  const url = process.env.TEKNOH_ENGINE_URL;
  const token = process.env.TEKNOH_ENGINE_TOKEN;
  if (!url || !token) return NextResponse.json({error:"Teknoh engine is not configured."},{status:503});
  const response = await fetch(`${url.replace(/\/$/,"")}/api/opportunities/search`, { method:"POST", headers:{"content-type":"application/json",authorization:`Bearer ${token}`}, body:JSON.stringify(parsed.data), cache:"no-store" });
  const body = await response.json().catch(()=>({error:"Engine returned an invalid response."}));
  return NextResponse.json(body,{status:response.status});
}
