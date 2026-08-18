import { NextResponse } from "next/server";
export function GET(){ return NextResponse.json({service:"teknoh-public",status:"ok"}); }
