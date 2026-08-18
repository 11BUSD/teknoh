import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";

export function GET(){
  try {
    getConfig();
    return NextResponse.json({service:"teknoh-public",status:"ok"},{headers:{"cache-control":"no-store"}});
  } catch {
    return NextResponse.json({service:"teknoh-public",status:"unavailable"},{status:503,headers:{"cache-control":"no-store"}});
  }
}
