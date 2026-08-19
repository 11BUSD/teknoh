import { NextResponse } from "next/server";

export async function POST(request: Request) {
  void request;
  return NextResponse.json(
    {error:"Anonymous live research is disabled. Create a verified Teknoh account to use the one-time free screening preview."},
    {status:410,headers:{"cache-control":"no-store"}},
  );
}
